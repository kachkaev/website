import fs from "node:fs/promises";
import path from "node:path";

import { dump, load } from "js-yaml";
import { cacheLife, cacheTag, revalidateTag } from "next/cache";
import { z } from "zod";

import { serverEnv } from "./server-env";

const twitterProfileInfoSchema = z.object({ tweetCount: z.number() });

const profileInfoSchemaLookup = {
  flickr: z.object({
    photoCount: z.number(),
    mostViewedPhotos: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        url: z.url(),
        thumbnailUrl: z.url(),
        views: z.number(),
      }),
    ),
  }),
  github: z.object({
    repoCount: z.number(),
    sourceCount: z.number(),
    languageCount: z.number(),
  }),
  linkedin: z.object({ connectionCount: z.number() }),
  openaccess: z.object({ paperCount: z.number() }),
  osm: z.object({
    changesetCount: z.number(),
    gpsTraceCount: z.number(),
  }),
  "twitter-en": twitterProfileInfoSchema,
  "twitter-ru": twitterProfileInfoSchema,
};

export type ProfileName = keyof typeof profileInfoSchemaLookup;

export type ProfileInfo<Name extends ProfileName> = z.infer<
  (typeof profileInfoSchemaLookup)[Name]
>;

/**
 * Same lookup, but as a mapped type, which can be indexed with a generic profile name.
 * This keeps the result of readProfileInfo() strongly typed.
 */
const indexableProfileInfoSchemaLookup: {
  [Name in ProfileName]: z.ZodType<ProfileInfo<Name>>;
} = profileInfoSchemaLookup;

const profileInfosDirPath = path.resolve(serverEnv.DATA_DIR, "profile-infos");
const profileInfosUpdateErrorsDirPath = path.resolve(
  profileInfosDirPath,
  "update-errors",
);

function generateProfileInfoCacheTag(profileName: ProfileName): string {
  return `profile-info:${profileName}`;
}

export async function readProfileInfo<Name extends ProfileName>(
  profileName: Name,
): Promise<ProfileInfo<Name> | undefined> {
  "use cache";
  // Profile infos only change when writeProfileInfo() is called, which expires the cache tag
  cacheLife("max");
  cacheTag(generateProfileInfoCacheTag(profileName));

  try {
    return indexableProfileInfoSchemaLookup[profileName].parse(
      load(
        await fs.readFile(
          path.resolve(profileInfosDirPath, `${profileName}.yaml`),
          "utf8",
        ),
      ),
    );
  } catch {
    // A profile info is missing until its first update and can go stale after a schema change
    return undefined;
  }
}

export async function writeProfileInfo<Name extends ProfileName>(
  profileName: Name,
  profileInfo: ProfileInfo<Name>,
): Promise<void> {
  await fs.mkdir(profileInfosDirPath, { recursive: true });
  await fs.writeFile(
    path.resolve(profileInfosDirPath, `${profileName}.yaml`),
    dump(profileInfo),
    "utf8",
  );

  revalidateTag(generateProfileInfoCacheTag(profileName), "max");
}

export function generateUpdateProfileErrorPathPrefix(
  profileName: ProfileName,
): string {
  const stringifiedTime = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", "-")
    .replaceAll(":", "");

  return path.resolve(
    profileInfosUpdateErrorsDirPath,
    `${stringifiedTime}-${profileName}`,
  );
}
