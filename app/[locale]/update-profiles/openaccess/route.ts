import { generateUpdateProfileErrorPathPrefix } from "../../shared/profile-infos";
import {
  extractDataFromWebPage,
  generateUpdateProfileHandler,
} from "../shared/handler-helpers";

const profileName = "openaccess";

export const GET = generateUpdateProfileHandler({
  profileName,
  generateProfileInfo: () =>
    extractDataFromWebPage({
      errorPathPrefix: generateUpdateProfileErrorPathPrefix(profileName),
      handler: async ({ page }) => {
        await page.goto(
          "https://openaccess.city.ac.uk/view/creators/Kachkaev=3AA=2E=3A=3A.html",
          { waitUntil: "domcontentloaded" },
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
      },
    }),
});

export const dynamic = "force-dynamic";
