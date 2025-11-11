import { generateUpdateTwitterProfileHandler } from "../shared/generate-update-twitter-profile-handler";

export const GET = generateUpdateTwitterProfileHandler({
  profileName: "twitter-ru",
  twitterAccountId: "kachkaev_ru",
});
