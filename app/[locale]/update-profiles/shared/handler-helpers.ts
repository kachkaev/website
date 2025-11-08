import fs from "node:fs/promises";
import path from "node:path";

import { type NextRequest, NextResponse } from "next/server";
import {
  type Browser,
  type BrowserContext,
  chromium,
  type Page,
} from "playwright";
import type { ZodType } from "zod";

import { writeProfileInfo } from "../../shared/profile-infos";
import { serverEnv } from "../../shared/server-env";

export async function extractDataFromWebPage<Data>({
  errorPathPrefix,
  handler,
}: {
  errorPathPrefix: string;
  handler: (payload: { page: Page }) => Promise<Data>;
}): Promise<Data> {
  let browser: Browser | undefined;
  let context: BrowserContext | undefined;
  let page: Page | undefined;

  try {
    browser = await chromium.launch({
      headless: serverEnv.PLAYWRIGHT_HEADLESS,
      timeout: 5000,
    });

    const proxyServerUrl = serverEnv.UPDATE_PROFILE_PROXY_SERVER_URL;

    context = await browser.newContext({
      userAgent: serverEnv.PLAYWRIGHT_USER_AGENT,
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
): Promise<Schema["_output"]> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: unknown = await response.json();

  return schema.parse(data);
}

export function generateUpdateProfileHandler({
  profileName,
  generateProfileInfo,
}: {
  profileName: string;
  generateProfileInfo: () => Promise<Record<string, unknown>>;
}): (request: NextRequest) => Promise<NextResponse> {
  return async (request) => {
    if (!serverEnv.UPDATE_PROFILE_SECURITY_TOKEN) {
      return NextResponse.json(
        { error: "Security token is not set" },
        { status: 500 },
      );
    }

    const securityTokenIsValid =
      request.headers.get("x-security-token") ===
        serverEnv.UPDATE_PROFILE_SECURITY_TOKEN ||
      new URL(request.url).searchParams.has(
        serverEnv.UPDATE_PROFILE_SECURITY_TOKEN,
      );

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
