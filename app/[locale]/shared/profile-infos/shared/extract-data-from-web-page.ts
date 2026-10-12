import fs from "node:fs/promises";
import path from "node:path";

import type { Browser, BrowserContext, Page } from "playwright";

import { serverEnv } from "../../server-env";

export async function extractDataFromWebPage<Data>({
  errorPathPrefix,
  handler,
}: {
  errorPathPrefix: string;
  handler: (payload: { page: Page }) => Promise<Data>;
}): Promise<Data> {
  // Pages that read profile infos import this module too, so Playwright is only loaded on update
  const { chromium } = await import("playwright");

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
      ...(proxyServerUrl && { proxy: { server: proxyServerUrl } }),
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
