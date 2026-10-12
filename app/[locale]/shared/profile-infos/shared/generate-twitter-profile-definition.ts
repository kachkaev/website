import { z } from "zod";

import { extractDataFromWebPage } from "./extract-data-from-web-page";
import type { ProfileDefinition } from "./types";

const infoSchema = z.object({ tweetCount: z.number() });

export function generateTwitterProfileDefinition(
  twitterAccountId: string,
): ProfileDefinition<typeof infoSchema> {
  return {
    infoSchema,
    generateInfo: ({ errorPathPrefix }) =>
      extractDataFromWebPage({
        errorPathPrefix,
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
  };
}
