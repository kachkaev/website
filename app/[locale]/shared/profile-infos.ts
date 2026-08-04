import fs from "node:fs/promises";
import path from "node:path";

import { dump, load } from "js-yaml";

import { serverEnv } from "./server-env";

function getDataDirPath(): string {
  return path.resolve(serverEnv.DATA_DIR);
}

function getProfileInfosDirPath(): string {
  return path.resolve(getDataDirPath(), "profile-infos");
}

const profileInfosDirPath = getProfileInfosDirPath();
const profileInfosUpdateErrorsDirPath = path.resolve(
  profileInfosDirPath,
  "update-errors",
);

export async function readProfileInfo(
  profileName: string,
): Promise<Record<string, unknown> | undefined> {
  try {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TODO: Use zod instead of type assertions
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
): Promise<void> {
  await fs.mkdir(profileInfosDirPath, { recursive: true });
  await fs.writeFile(
    path.resolve(profileInfosDirPath, `${profileName}.yaml`),
    dump(profileInfo),
    "utf8",
  );
}

export function generateUpdateProfileErrorPathPrefix(
  profileName: string,
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
