import { z } from "zod";

import {
  fetchJson,
  generateUpdateProfileHandler,
} from "../shared/handler-helpers";

export const GET = generateUpdateProfileHandler({
  profileName: "flickr",
  generateProfileInfo: async () => {
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
});
