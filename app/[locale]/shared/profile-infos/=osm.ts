import { z } from "zod";

import { fetchJson } from "./shared/fetch-json";
import type { ProfileDefinition } from "./shared/types";

const infoSchema = z.object({
  changesetCount: z.number(),
  gpsTraceCount: z.number(),
});

export const osmProfileDefinition = {
  infoSchema,
  generateInfo: async () => {
    const data = await fetchJson(
      "https://www.openstreetmap.org/api/0.6/user/231451.json",
      z.object({
        user: z.object({
          changesets: z.object({ count: z.number() }),
          traces: z.object({ count: z.number() }),
        }),
      }),
    );

    return {
      changesetCount: data.user.changesets.count,
      gpsTraceCount: data.user.traces.count,
    };
  },
} satisfies ProfileDefinition<typeof infoSchema>;
