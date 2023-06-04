import fs from "node:fs/promises";
import path from "node:path";

import { dump, load } from "js-yaml";

import { cleanProcessEnv, envalid } from "./env";

function getDataDirPath(): string {
  const env = cleanProcessEnv({
    DATA_DIR: envalid.str({
      default: "./data",
    }),
  });

  return path.resolve(env.DATA_DIR);
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

export async function ensureProfileInfosUpdateErrorsDir(): Promise<void> {
  await fs.mkdir(path.resolve(profileInfosUpdateErrorsDirPath), {
    recursive: true,
  });
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
