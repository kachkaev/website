import fs from "node:fs/promises";
import path from "node:path";

import { dump, load } from "js-yaml";
import { cacheLife, cacheTag, io, revalidateTag } from "next/cache";
import type { z } from "zod";

import { flickrProfileDefinition } from "./profile-infos/=flickr";
import { githubProfileDefinition } from "./profile-infos/=github";
import { linkedinProfileDefinition } from "./profile-infos/=linkedin";
import { openaccessProfileDefinition } from "./profile-infos/=openaccess";
import { osmProfileDefinition } from "./profile-infos/=osm";
import { twitterEnProfileDefinition } from "./profile-infos/=twitter-en";
import { twitterRuProfileDefinition } from "./profile-infos/=twitter-ru";
import type { ProfileDefinition } from "./profile-infos/shared/types";
import { serverEnv } from "./server-env";

const profileDefinitionLookup = {
  flickr: flickrProfileDefinition,
  github: githubProfileDefinition,
  linkedin: linkedinProfileDefinition,
  openaccess: openaccessProfileDefinition,
  osm: osmProfileDefinition,
  "twitter-en": twitterEnProfileDefinition,
  "twitter-ru": twitterRuProfileDefinition,
} satisfies Record<string, ProfileDefinition>;

type ProfileName = keyof typeof profileDefinitionLookup;

type ProfileInfo<Name extends ProfileName> = z.output<
  (typeof profileDefinitionLookup)[Name]["infoSchema"]
>;

/**
 * Same lookup, but as a mapped type, which can be indexed with a generic profile name.
 * This keeps the results of readProfileInfo() and updateProfileInfo() strongly typed.
 */
const indexableProfileDefinitionLookup: {
  [Name in ProfileName]: ProfileDefinition<z.ZodType<ProfileInfo<Name>>>;
} = profileDefinitionLookup;

export function isProfileName(value: string): value is ProfileName {
  return Object.hasOwn(profileDefinitionLookup, value);
}

const profileInfosDirPath = path.resolve(serverEnv.DATA_DIR, "profile-infos");
const profileInfosUpdateErrorsDirPath = path.resolve(
  profileInfosDirPath,
  "update-errors",
);

function generateProfileInfoCacheTag(profileName: ProfileName): string {
  return `profile-info:${profileName}`;
}

async function readCachedProfileInfo<Name extends ProfileName>(
  profileName: Name,
): Promise<ProfileInfo<Name> | undefined> {
  "use cache";
  // Profile infos only change when updateProfileInfo() is called, which expires the cache tag
  cacheLife("max");
  cacheTag(generateProfileInfoCacheTag(profileName));

  try {
    return indexableProfileDefinitionLookup[profileName].infoSchema.parse(
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

export async function readProfileInfo<Name extends ProfileName>(
  profileName: Name,
): Promise<ProfileInfo<Name> | undefined> {
  // Profile infos live in DATA_DIR, which is only populated at runtime. Without this,
  // `next build` would bake whatever it finds there (usually nothing) into the static shell.
  await io();

  return await readCachedProfileInfo(profileName);
}

function generateUpdateProfileErrorPathPrefix(
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

export async function updateProfileInfo<Name extends ProfileName>(
  profileName: Name,
): Promise<ProfileInfo<Name>> {
  const { generateInfo } = indexableProfileDefinitionLookup[profileName];
  const profileInfo = await generateInfo({
    errorPathPrefix: generateUpdateProfileErrorPathPrefix(profileName),
  });

  await fs.mkdir(profileInfosDirPath, { recursive: true });
  await fs.writeFile(
    path.resolve(profileInfosDirPath, `${profileName}.yaml`),
    dump(profileInfo),
    "utf8",
  );

  revalidateTag(generateProfileInfoCacheTag(profileName), "max");

  return profileInfo;
}
