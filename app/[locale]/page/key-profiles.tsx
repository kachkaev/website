import { createIntl, createIntlCache } from "@formatjs/intl";
import * as React from "react";

import type { Dictionary, LocaleParam } from "../../../i18n-config";
import { readProfileInfo } from "../shared/profile-infos";

const intlCache = createIntlCache();

interface KeyProfileProps {
  locale: LocaleParam;
  dictionary: Dictionary;
}

function formatMessage(
  locale: LocaleParam,
  messageLookup: Dictionary["index"],
  messageId: keyof Dictionary["index"],
  valueLookup: Record<string, unknown>,
): string {
  const intl = createIntl({ locale, messages: messageLookup }, intlCache);

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
        <a className="font-semibold whitespace-nowrap" href={url}>
          {name}
        </a>
      </h2>
      <p className="mt-px mb-3 opacity-60">{children ?? <>&nbsp;</>}</p>
    </>
  );
}

async function Openaccess({ locale, dictionary }: KeyProfileProps) {
  const profileInfo = await readProfileInfo("openaccess");

  return (
    <KeyProfile
      name={dictionary.index["profiles.openaccess.name"]}
      url="https://openaccess.city.ac.uk/view/creators/Kachkaev=3AA=2E=3A=3A.html"
    >
      {profileInfo ? (
        <>
          {formatMessage(
            locale,
            dictionary.index,
            "profiles.openaccess.description.1",
            profileInfo,
          )}
          <a href="https://openaccess.city.ac.uk/12460/">
            {dictionary.index["profiles.openaccess.description.2"]}
          </a>
          {dictionary.index["profiles.openaccess.description.3"]}
        </>
      ) : undefined}
    </KeyProfile>
  );
}

async function LinkedIn({ locale, dictionary }: KeyProfileProps) {
  const profileInfo = await readProfileInfo("linkedin");

  return (
    <KeyProfile
      name={dictionary.index["profiles.linkedin.name"]}
      url="https://www.linkedin.com/in/kachkaev/"
    >
      {profileInfo
        ? formatMessage(
            locale,
            dictionary.index,
            "profiles.linkedin.description",
            profileInfo,
          )
        : undefined}
    </KeyProfile>
  );
}

async function GitHub({ locale, dictionary }: KeyProfileProps) {
  const profileInfo = await readProfileInfo("github");

  return (
    <KeyProfile
      name={dictionary.index["profiles.github.name"]}
      url="https://github.com/kachkaev"
    >
      {profileInfo ? (
        <>
          {formatMessage(
            locale,
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

async function Osm({ locale, dictionary }: KeyProfileProps) {
  const profileInfo = await readProfileInfo("osm");

  return (
    <KeyProfile
      name={dictionary.index["profiles.osm.name"]}
      url="https://www.openstreetmap.org/user/Kachkaev"
    >
      {profileInfo ? (
        <>
          {formatMessage(
            locale,
            dictionary.index,
            "profiles.osm.description.1",
            profileInfo,
          )}
          <a href="https://yosmhm.neis-one.org/?u=Kachkaev&zoom=3&lat=50&lon=20&layers=B00TTF">
            {dictionary.index["profiles.osm.description.2"]}
          </a>
          {dictionary.index["profiles.osm.description.3"]}
        </>
      ) : undefined}
    </KeyProfile>
  );
}

async function Twitter({ locale, dictionary }: KeyProfileProps) {
  const profileInfoEn = await readProfileInfo("twitter-en");
  const profileInfoRu = await readProfileInfo("twitter-ru");
  const urlEn = "https://twitter.com/kachkaev";
  const urlRu = "https://twitter.com/kachkaev_ru";

  return (
    <KeyProfile
      name={dictionary.index["profiles.twitter.name"]}
      url={locale === "en" ? urlEn : urlRu}
    >
      {profileInfoEn && profileInfoRu ? (
        <>
          {formatMessage(
            locale,
            dictionary.index,
            "profiles.twitter.description.1",
            locale === "en" ? profileInfoEn : profileInfoRu,
          )}
          {formatMessage(
            locale,
            dictionary.index,
            "profiles.twitter.description.2",
            locale === "en" ? profileInfoRu : profileInfoEn,
          )}
          <a href={locale === "en" ? urlRu : urlEn}>
            {dictionary.index["profiles.twitter.description.3"]}
          </a>
        </>
      ) : undefined}
    </KeyProfile>
  );
}

async function Flickr({ locale, dictionary }: KeyProfileProps) {
  const profileInfo = await readProfileInfo("flickr");

  const mostViewedPhotos = profileInfo?.["mostViewedPhotos"] as
    | Array<{ title: string; url: string; thumbnailUrl: string }>
    | undefined;

  return (
    <>
      <KeyProfile
        name={dictionary.index["profiles.flickr.name"]}
        url="https://www.flickr.com/people/kachkaev"
      >
        {profileInfo ? (
          <>
            {formatMessage(
              locale,
              dictionary.index,
              "profiles.flickr.description",
              profileInfo,
            )}
          </>
        ) : undefined}
      </KeyProfile>
      {mostViewedPhotos && (
        <div className="relative -mt-2 h-[50px] overflow-hidden rounded-[5px] bg-gray-300 bg-clip-padding">
          <div className="absolute whitespace-nowrap">
            {mostViewedPhotos
              .sort(() => (Math.random() >= 0.5 ? 1 : -1))
              .slice(0, 9)
              .map(({ thumbnailUrl, title, url }) => (
                <a
                  key={url}
                  href={url}
                  title={title}
                  className="group relative inline-block size-[50px] border-none! grayscale hover:grayscale-0 active:grayscale-0"
                >
                  <img
                    className="inline-block"
                    src={thumbnailUrl}
                    alt={title}
                    width={50}
                    height={50}
                  />
                  <span className="absolute inset-x-0 bottom-0 block bg-slate-500 group-hover:border-t-2 group-hover:border-t-red-500" />
                </a>
              ))}
          </div>
        </div>
      )}
      {}
    </>
  );
}

export default async function KeyProfiles(props: KeyProfileProps) {
  return (
    <>
      <Openaccess {...props} />
      <LinkedIn {...props} />
      <GitHub {...props} />
      <Osm {...props} />
      <Twitter {...props} />
      <Flickr {...props} />
    </>
  );
}
