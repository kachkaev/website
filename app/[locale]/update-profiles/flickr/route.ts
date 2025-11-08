import { z } from "zod";

import { cleanProcessEnv, envalid } from "../../shared/env";
import {
  fetchJson,
  generateUpdateProfileHandler,
} from "../shared/handler-helpers";

export const GET = generateUpdateProfileHandler({
  profileName: "flickr",
  generateProfileInfo: async () => {
    const env = cleanProcessEnv({
      FLICKR_API_KEY: envalid.str(),
      FLICKR_USER_ID: envalid.str(),
    });

    const data = await fetchJson(
      `https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=${env.FLICKR_API_KEY}&user_id=${env.FLICKR_USER_ID}&extras=description%2C+license%2C+date_upload%2C+date_taken%2C+owner_name%2C+icon_server%2C+original_format%2C+last_update%2C+geo%2C+tags%2C+machine_tags%2C+o_dims%2C+views%2C+media%2C+path_alias%2C+url_sq%2C+url_t%2C+url_s%2C+url_q%2C+url_m%2C+url_n%2C+url_z%2C+url_c%2C+url_l%2C+url_o&per_page=500&format=json&nojsoncallback=1`,
      z.object({
        photos: z.object({
          total: z.number(),
          photo: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              url_sq: z.string(),
              views: z.string(),
            }),
          ),
        }),
      }),
    );

    const mostViewedPhotos = data.photos.photo
      .map((photo) => ({
        id: photo.id,
        title: photo.title,
        url: `https://www.flickr.com/photos/kachkaev/${photo.id}/`,
        thumbnailUrl: photo["url_sq"],
        views: Number.parseInt(photo.views),
      }))
      .toSorted((a, b) => b.views - a.views)
      .slice(0, 100);

    return {
      photoCount: data.photos.total,
      mostViewedPhotos,
    };
  },
});
