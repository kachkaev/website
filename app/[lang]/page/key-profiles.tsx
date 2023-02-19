import fs from "node:fs/promises";

import { createIntl, createIntlCache } from "@formatjs/intl";
import { load } from "js-yaml";
import * as React from "react";

import type { Dictionary, Locale } from "../../../i18n-config";

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache();

interface KeyProfileProps {
  lang: Locale;
  dictionary: Dictionary;
}

async function readProfileInfo(
  baseFileName: string,
): Promise<Record<string, unknown> | undefined> {
  try {
    return load(
      await fs.readFile(`./profile-infos/${baseFileName}.yaml`, "utf8"),
    ) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

function formatMessage(
  locale: Locale,
  messageLookup: Dictionary["index"],
  messageId: keyof Dictionary["index"],
  valueLookup: Record<string, unknown>,
): string {
  const intl = createIntl({ locale, messages: messageLookup }, cache);

  return intl.formatMessage(
    { id: messageId },
    valueLookup as Record<string, string>,
  );
}

function KeyProfile({
  name,
  url,
  children,
}: {
  name: string;
  url: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h2>
        <a className="whitespace-nowrap font-semibold" href={url}>
          {name}
        </a>
      </h2>
      <p className="mb-4 opacity-60">{children ?? <>&nbsp;</>}</p>
    </>
  );
}

export async function Openaccess({ lang, dictionary }: KeyProfileProps) {
  const profileInfo = await readProfileInfo("openaccess");

  return (
    <KeyProfile
      name={dictionary.index["profiles.openaccess.name"]}
      url="http://openaccess.city.ac.uk/view/creators/Kachkaev=3AA=2E=3A=3A.html"
    >
      {profileInfo ? (
        <>
          {formatMessage(
            lang,
            dictionary.index,
            "profiles.openaccess.description.1",
            profileInfo,
          )}
          <a href="http://openaccess.city.ac.uk/12460/">
            {dictionary.index["profiles.openaccess.description.2"]}
          </a>
          {dictionary.index["profiles.openaccess.description.3"]}
        </>
      ) : undefined}
    </KeyProfile>
  );
}

export async function LinkedIn({ lang, dictionary }: KeyProfileProps) {
  const profileInfo = await readProfileInfo("linkedin");

  return (
    <KeyProfile
      name={dictionary.index["profiles.linkedin.name"]}
      url="https://www.linkedin.com/in/kachkaev/"
    >
      {profileInfo
        ? formatMessage(
            lang,
            dictionary.index,
            "profiles.linkedin.description",
            profileInfo,
          )
        : undefined}
    </KeyProfile>
  );
}

export async function GitHub({ lang, dictionary }: KeyProfileProps) {
  const profileInfo = await readProfileInfo("github");

  return (
    <KeyProfile
      name={dictionary.index["profiles.github.name"]}
      url="https://github.com/kachkaev"
    >
      {profileInfo ? (
        <>
          {formatMessage(
            lang,
            dictionary.index,
            "profiles.github.description.1",
            profileInfo,
          )}
          <a href="https://github.com/kachkaev/website">
            {dictionary.index["profiles.github.description.2"]}
          </a>
          {dictionary.index["profiles.github.description.3"]}
        </>
      ) : undefined}
    </KeyProfile>
  );
}

export async function Osm({ lang, dictionary }: KeyProfileProps) {
  const profileInfo = await readProfileInfo("osm");

  return (
    <KeyProfile
      name={dictionary.index["profiles.osm.name"]}
      url="https://www.openstreetmap.org/user/Kachkaev"
    >
      {profileInfo ? (
        <>
          {formatMessage(
            lang,
            dictionary.index,
            "profiles.osm.description.1",
            profileInfo,
          )}
          <a href="https://yosmhm.neis-one.org/?u=Kachkaev&zoom=4&lat=50&lon=20&layers=B00TTF">
            {dictionary.index["profiles.osm.description.2"]}
          </a>
          {dictionary.index["profiles.osm.description.3"]}
        </>
      ) : undefined}
    </KeyProfile>
  );
}

export async function Twitter({ lang, dictionary }: KeyProfileProps) {
  const profileInfoEn = await readProfileInfo("twitter-en");
  const profileInfoRu = await readProfileInfo("twitter-ru");
  const urlEn = "https://twitter.com/kachkaev";
  const urlRu = "https://twitter.com/kachkaev_ru";

  return (
    <KeyProfile
      name={dictionary.index["profiles.twitter.name"]}
      url={lang === "en" ? urlEn : urlRu}
    >
      {profileInfoEn && profileInfoRu ? (
        <>
          {formatMessage(
            lang,
            dictionary.index,
            "profiles.twitter.description.1",
            lang === "en" ? profileInfoEn : profileInfoRu,
          )}
          {formatMessage(
            lang,
            dictionary.index,
            "profiles.twitter.description.2",
            lang === "en" ? profileInfoRu : profileInfoEn,
          )}
          <a href={lang === "en" ? urlRu : urlEn}>
            {dictionary.index["profiles.twitter.description.3"]}
          </a>
        </>
      ) : undefined}
    </KeyProfile>
  );
}

export async function Flickr({ lang, dictionary }: KeyProfileProps) {
  const profileInfo = await readProfileInfo("flickr");

  return (
    <>
      <KeyProfile
        name={dictionary.index["profiles.flickr.name"]}
        url="https://www.flickr.com/people/kachkaev"
      >
        {profileInfo ? (
          <>
            {formatMessage(
              lang,
              dictionary.index,
              "profiles.flickr.description",
              profileInfo,
            )}
          </>
        ) : undefined}
      </KeyProfile>
      <div>TODO</div>
    </>
  );
}
