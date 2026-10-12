import { z } from "zod";

import { extractDataFromWebPage } from "./shared/extract-data-from-web-page";
import type { ProfileDefinition } from "./shared/types";

const infoSchema = z.object({ paperCount: z.number() });

export const openaccessProfileDefinition = {
  infoSchema,
  generateInfo: ({ errorPathPrefix }) =>
    extractDataFromWebPage({
      errorPathPrefix,
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
} satisfies ProfileDefinition<typeof infoSchema>;
