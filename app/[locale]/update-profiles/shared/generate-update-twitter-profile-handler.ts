import { generateUpdateProfileHandler } from "./handler-helpers";
import { extractDataFromWebPage } from "./playwright-helpers";

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
      extractDataFromWebPage(async ({ page }) => {
        await page.goto(`https://twitter.com/${twitterAccountId}`);
        const rawTweetCount = await page.locator("h2+div").textContent();
        const tweetCount = Number.parseInt(rawTweetCount ?? "");

        return { tweetCount };
      }),
  });
}
