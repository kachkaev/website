import {
  extractDataFromWebPage,
  generateUpdateProfileHandler,
} from "../shared/handler-helpers";

export const GET = generateUpdateProfileHandler({
  profileName: "openaccess",
  generateProfileInfo: () =>
    extractDataFromWebPage(async ({ page }) => {
      await page.goto(
        "https://openaccess.city.ac.uk/view/creators/Kachkaev=3AA=2E=3A=3A.html",
      );

      const rawPaperCount = await page
        .locator(".ep_view_blurb strong")
        .textContent();
      const paperCount = Number.parseInt(rawPaperCount ?? "");

      if (!paperCount) {
        throw new Error(
          `Failed to extract paper count (${rawPaperCount} unexpected)`,
        );
      }

      return { paperCount };
    }),
});
