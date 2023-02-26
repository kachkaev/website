import axios, { AxiosProxyConfig } from "axios";
import { NextResponse } from "next/server";
import type { Browser, BrowserContext, Page } from "playwright";
import type { TypeOf, ZodType } from "zod";

import { cleanProcessEnv, envalid } from "../../shared/env";
import { writeProfileInfo } from "../../shared/profile-infos";

function getProxyServerUrl(): string | undefined {
  const env = cleanProcessEnv({
    UPDATE_PROFILE_PROXY_SERVER_URL: envalid.str({ default: "" }),
  });

  return env.UPDATE_PROFILE_PROXY_SERVER_URL || undefined;
}

function getProxyServerAxiosConfig(): AxiosProxyConfig | false {
  const proxyServerUrl = getProxyServerUrl();
  if (!proxyServerUrl) {
    return false;
  }
  const parsedProxyServerUrl = new URL(proxyServerUrl);

  return {
    protocol: parsedProxyServerUrl.protocol,
    host: parsedProxyServerUrl.hostname,
    port: Number.parseInt(parsedProxyServerUrl.port),
  };
}

export async function extractDataFromWebPage<Data>(
  handler: (payload: { page: Page }) => Promise<Data>,
): Promise<Data> {
  const env = cleanProcessEnv({
    PLAYWRIGHT_HEADLESS: envalid.bool({ default: true }),
    PLAYWRIGHT_USER_AGENT: envalid.str({
      default:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/110.0",
    }),
  });

  // eslint-disable-next-line no-eval -- Some internal Playwright imports do not work when bundled by webpack
  const { firefox } = (await eval(
    'import("playwright")',
  )) as typeof import("playwright");

  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let page: Page | undefined;

  try {
    // Using Firefox because LinkedIn redirects to auth wall on headless Chromium
    browser = await firefox.launch({
      headless: env.PLAYWRIGHT_HEADLESS,
    });

    const proxyServerUrl = getProxyServerUrl();

    context = await browser.newContext({
      userAgent: env.PLAYWRIGHT_USER_AGENT,
      ...(proxyServerUrl ? { proxy: { server: proxyServerUrl } } : {}),
    });

    context.setDefaultTimeout(5000);
    context.setDefaultNavigationTimeout(10_000);

    page = await context.newPage();
    await page.setViewportSize({
      width: 986,
      height: 810,
    });

    return await handler({ page });
    // eslint-disable-next-line no-useless-catch -- @todo implement proper error handling (save screenshot, error message, etc.)
  } catch (error: unknown) {
    // if (page) {
    //   await page.screenshot({ path: "/Users/ak/Desktop/screenshot.png" });
    // }
    throw error;
  } finally {
    await page?.close();
    await context?.close();
    await browser?.close();
  }
}

export async function fetchJson<Schema extends ZodType>(
  url: string,
  schema: Schema,
): Promise<TypeOf<Schema>> {
  const response = await axios.get(url, {
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
    },
    proxy: getProxyServerAxiosConfig(),
  });

  return schema.parse(response.data) as unknown;
}

export function generateUpdateProfileHandler({
  profileName,
  generateProfileInfo,
}: {
  profileName: string;
  generateProfileInfo: () => Promise<Record<string, unknown>>;
}): (request: Request) => Promise<NextResponse> {
  return async (request) => {
    const env = cleanProcessEnv({
      UPDATE_PROFILE_SECURITY_TOKEN: envalid.str(),
    });

    const securityTokenIsValid =
      request.headers.get("x-security-token") ===
        env.UPDATE_PROFILE_SECURITY_TOKEN ||
      new URL(request.url).searchParams.has(env.UPDATE_PROFILE_SECURITY_TOKEN);

    if (!securityTokenIsValid) {
      return NextResponse.json(
        { error: "Security token is invalid or missing" },
        { status: 403 },
      );
    }

    try {
      const profileInfo = await generateProfileInfo();
      await writeProfileInfo(profileName, profileInfo);

      return NextResponse.json({ profileInfo });
    } catch (error: unknown) {
      return NextResponse.json({
        error: error instanceof Error ? error.message : error,
      });
    }
  };
}
