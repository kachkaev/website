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
): Promise<unknown | undefined> {
  try {
    return load(
      await fs.readFile(`./profile-infos/${baseFileName}.yaml`, "utf8"),
    );
  } catch {
    return undefined;
  }
}

function stringifyProfileInfo(
  profileInfo: unknown,
  locale: Locale,
  message: string,
): string {
  const intl = createIntl(
    {
      locale,
      messages: {},
    },
    cache,
  );

  return intl.formatMessage(
    {
      id: message || " ",
      defaultMessage: message,
    },
    profileInfo as Record<string, string>,
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
    <div>
      <h2>
        <a className="whitespace-nowrap font-semibold" href={url}>
          {name}
        </a>
      </h2>
      <p>{children}</p>
    </div>
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
          {stringifyProfileInfo(
            profileInfo,
            lang,
            dictionary.index["profiles.openaccess.description.1"],
          )}
          <a href="http://openaccess.city.ac.uk/12460/">
            {stringifyProfileInfo(
              profileInfo,
              lang,
              dictionary.index["profiles.openaccess.description.2"],
            )}
          </a>
          {stringifyProfileInfo(
            profileInfo,
            lang,
            dictionary.index["profiles.openaccess.description.3"],
          )}
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
        ? stringifyProfileInfo(
            profileInfo,
            lang,
            dictionary.index["profiles.linkedin.description"],
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
          {stringifyProfileInfo(
            profileInfo,
            lang,
            dictionary.index["profiles.github.description.1"],
          )}
          <a href="https://github.com/kachkaev/website">
            {stringifyProfileInfo(
              profileInfo,
              lang,
              dictionary.index["profiles.github.description.2"],
            )}
          </a>
          {stringifyProfileInfo(
            profileInfo,
            lang,
            dictionary.index["profiles.github.description.3"],
          )}
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
          {stringifyProfileInfo(
            profileInfo,
            lang,
            dictionary.index["profiles.osm.description.1"],
          )}
          <a href="http://yosmhm.neis-one.org/?u=Kachkaev">
            {stringifyProfileInfo(
              profileInfo,
              lang,
              dictionary.index["profiles.osm.description.2"],
            )}
          </a>
          {stringifyProfileInfo(
            profileInfo,
            lang,
            dictionary.index["profiles.osm.description.3"],
          )}
        </>
      ) : undefined}
    </KeyProfile>
  );
}

export async function Twitter(/* {  lang, dictionary  }: KeyProfileProps */) {
  return <p>Twitter - TODO</p>;
}

export async function Flickr({ lang, dictionary }: KeyProfileProps) {
  const profileInfo = await readProfileInfo("flickr");

  return (
    <KeyProfile
      name={dictionary.index["profiles.flickr.name"]}
      url="https://www.flickr.com/people/kachkaev"
    >
      {profileInfo ? (
        <>
          {stringifyProfileInfo(
            profileInfo,
            lang,
            dictionary.index["profiles.flickr.description"],
          )}
          <div>TODO</div>
        </>
      ) : undefined}
    </KeyProfile>
  );
}
