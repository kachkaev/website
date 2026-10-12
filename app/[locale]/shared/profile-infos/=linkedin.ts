import { z } from "zod";

import { extractDataFromWebPage } from "./shared/extract-data-from-web-page";
import type { ProfileDefinition } from "./shared/types";

const infoSchema = z.object({ connectionCount: z.number() });

export const linkedinProfileDefinition = {
  infoSchema,
  generateInfo: ({ errorPathPrefix }) =>
    extractDataFromWebPage({
      errorPathPrefix,
      handler: async ({ page }) => {
        await page.goto("https://www.linkedin.com/in/kachkaev/", {
          waitUntil: "domcontentloaded",
        });

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
} satisfies ProfileDefinition<typeof infoSchema>;
