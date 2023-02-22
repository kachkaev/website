import {
  extractDataFromWebPage,
  generateUpdateProfileHandler,
} from "../shared/handler-helpers";

export const GET = generateUpdateProfileHandler({
  profileName: "linkedin",
  generateProfileInfo: () =>
    extractDataFromWebPage(async ({ page }) => {
      await page.goto("https://www.linkedin.com/in/kachkaev/");

      const rawConnectionCount = await page
        .locator(".top-card__subline-item:last-child")
        .textContent();
      const connectionCount = Number.parseInt(rawConnectionCount ?? "");

      if (!connectionCount) {
        throw new Error(
          `Failed to extract connection count (${rawConnectionCount} unexpected)`,
        );
      }

      return { connectionCount };
    }),
});

export const dynamic = "force-dynamic";
