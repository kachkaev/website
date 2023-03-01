import { generateUpdateProfileErrorPathPrefix } from "../../shared/profile-infos";
import {
  extractDataFromWebPage,
  generateUpdateProfileHandler,
} from "./handler-helpers";

export function generateUpdateTwitterProfileHandler({
  profileName,
  twitterAccountId,
}: {
  profileName: string;
  twitterAccountId: string;
}) {
  return generateUpdateProfileHandler({
    profileName,
    generateProfileInfo: () =>
      extractDataFromWebPage({
        errorPathPrefix: generateUpdateProfileErrorPathPrefix(profileName),
        handler: async ({ page }) => {
          await page.goto(`https://twitter.com/${twitterAccountId}`, {
            waitUntil: "domcontentloaded",
          });
          const rawTweetCount = await page.locator("h2+div").textContent();
          const tweetCount = Number.parseInt(rawTweetCount ?? "");

          if (!tweetCount) {
            throw new Error(
              `Failed to extract tweet count (${rawTweetCount} unexpected)`,
            );
          }

          return { tweetCount };
        },
      }),
  });
}
