import { generateUpdateProfileErrorPathPrefix } from "../../shared/profile-infos";
import {
  extractDataFromWebPage,
  generateUpdateProfileHandler,
} from "../shared/handler-helpers";

const profileName = "linkedin";

export const GET = generateUpdateProfileHandler({
  profileName,
  generateProfileInfo: () =>
    extractDataFromWebPage({
      errorPathPrefix: generateUpdateProfileErrorPathPrefix(profileName),
      handler: async ({ page }) => {
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
      },
    }),
});

export const dynamic = "force-dynamic";
