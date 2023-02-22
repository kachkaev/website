import * as envalid from "envalid";
import type { Browser, Page } from "playwright";

export async function extractDataFromWebPage<Data>(
  handler: (payload: { page: Page }) => Promise<Data>,
): Promise<Data> {
  const env = envalid.cleanEnv(process.env, {
    PLAYWRIGHT_HEADLESS: envalid.bool({ default: true }),
    PLAYWRIGHT_USER_AGENT: envalid.str({
      default:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    }),
  });

  // eslint-disable-next-line no-eval -- Some internal Playwright imports do not work when bundled by webpack
  const { chromium } = (await eval(
    'import("playwright")',
  )) as typeof import("playwright");

  let browser: Browser | undefined;
  try {
    browser = await chromium.launch({
      headless: env.PLAYWRIGHT_HEADLESS,
    });

    const playwrightContext = await browser.newContext({
      userAgent: env.PLAYWRIGHT_USER_AGENT,
    });

    const page = await playwrightContext.newPage();

    return await handler({ page });
  } finally {
    await browser?.close();
  }
}
