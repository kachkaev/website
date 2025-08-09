import fs from "node:fs/promises";
import path from "node:path";

import axios from "axios";
import { NextResponse } from "next/server";
import type { Browser, BrowserContext, Page } from "playwright";
import { firefox } from "playwright";
import type { TypeOf, ZodType } from "zod";

import { cleanProcessEnv, envalid } from "../../shared/env";
import { writeProfileInfo } from "../../shared/profile-infos";

function getProxyServerUrl(): string | undefined {
  const env = cleanProcessEnv({
    UPDATE_PROFILE_PROXY_SERVER_URL: envalid.str({ default: "" }),
  });

  return env.UPDATE_PROFILE_PROXY_SERVER_URL || undefined;
}

export async function extractDataFromWebPage<Data>({
  errorPathPrefix,
  handler,
}: {
  errorPathPrefix: string;
  handler: (payload: { page: Page }) => Promise<Data>;
}): Promise<Data> {
  const env = cleanProcessEnv({
    PLAYWRIGHT_HEADLESS: envalid.bool({ default: true }),
    PLAYWRIGHT_USER_AGENT: envalid.str({
      default:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/110.0",
    }),
  });

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
    context.setDefaultNavigationTimeout(15_000);
    await context.tracing.start({ snapshots: true, screenshots: true });

    page = await context.newPage();
    await page.setViewportSize({
      width: 986,
      height: 810,
    });

    return await handler({ page });
  } catch (error: unknown) {
    await fs.mkdir(path.dirname(errorPathPrefix), { recursive: true });
    await context?.tracing.stop({
      path: `${errorPathPrefix}.playwright-trace.zip`,
    });
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
  });

  return schema.parse(response.data);
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
      return NextResponse.json(
        { error: error instanceof Error ? error.message : error },
        { status: 500 },
      );
    }
  };
}
