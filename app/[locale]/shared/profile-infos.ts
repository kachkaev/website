import fs from "node:fs/promises";
import path from "node:path";

import { dump, load } from "js-yaml";

import { cleanProcessEnv, envalid } from "./env";

function getProfileInfosDirPath(): string {
  const env = cleanProcessEnv({
    PROFILE_INFOS_DIR: envalid.str({
      default: "./profile-infos",
    }),
  });

  return path.resolve(env.PROFILE_INFOS_DIR);
}

const profileInfosDirPath = getProfileInfosDirPath();

export async function readProfileInfo(
  profileName: string,
): Promise<Record<string, unknown> | undefined> {
  try {
    return load(
      await fs.readFile(
        path.resolve(profileInfosDirPath, `${profileName}.yaml`),
        "utf8",
      ),
    ) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

export async function writeProfileInfo(
  profileName: string,
  profileInfo: Record<string, unknown>,
) {
  await fs.mkdir(profileInfosDirPath, { recursive: true });
  await fs.writeFile(
    path.resolve(profileInfosDirPath, `${profileName}.yaml`),
    dump(profileInfo),
    "utf8",
  );
}
