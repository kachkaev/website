import { getLocale, getTranslations } from "next-intl/server";
import type * as React from "react";

import { readProfileInfo } from "../shared/profile-infos";

/**
 * @todo Use zod to parse profile infos, which would make this helper unnecessary
 */
function readCount(
  profileInfo: Record<string, unknown> | undefined,
  key: string,
): number | undefined {
  const value = profileInfo?.[key];

  return typeof value === "number" ? value : undefined;
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

async function Openaccess() {
  const t = await getTranslations("index");
  const paperCount = readCount(
    await readProfileInfo("openaccess"),
    "paperCount",
  );

  return (
    <KeyProfile
      name={t("profiles.openaccess.name")}
      url="https://openaccess.city.ac.uk/view/creators/Kachkaev=3AA=2E=3A=3A.html"
    >
      {paperCount === undefined
        ? undefined
        : t.rich("profiles.openaccess.description", {
            paperCount,
            thesis: (chunks) => (
              <a href="https://openaccess.city.ac.uk/12460/">{chunks}</a>
            ),
          })}
    </KeyProfile>
  );
}

async function LinkedIn() {
  const t = await getTranslations("index");
  const connectionCount = readCount(
    await readProfileInfo("linkedin"),
    "connectionCount",
  );

  return (
    <KeyProfile
      name={t("profiles.linkedin.name")}
      url="https://www.linkedin.com/in/kachkaev/"
    >
      {connectionCount === undefined
        ? undefined
        : t("profiles.linkedin.description", { connectionCount })}
    </KeyProfile>
  );
}

async function GitHub() {
  const t = await getTranslations("index");
  const repoCount = readCount(await readProfileInfo("github"), "repoCount");

  return (
    <KeyProfile
      name={t("profiles.github.name")}
      url="https://github.com/kachkaev"
    >
      {repoCount === undefined
        ? undefined
        : t.rich("profiles.github.description", {
            repoCount,
            website: (chunks) => (
              <a href="https://github.com/kachkaev/website">{chunks}</a>
            ),
          })}
    </KeyProfile>
  );
}

async function Osm() {
  const t = await getTranslations("index");
  const profileInfo = await readProfileInfo("osm");
  const changesetCount = readCount(profileInfo, "changesetCount");
  const gpsTraceCount = readCount(profileInfo, "gpsTraceCount");

  return (
    <KeyProfile
      name={t("profiles.osm.name")}
      url="https://www.openstreetmap.org/user/Kachkaev"
    >
      {changesetCount === undefined || gpsTraceCount === undefined
        ? undefined
        : t.rich("profiles.osm.description", {
            changesetCount,
            gpsTraceCount,
            hdyc: (chunks) => (
              <a href="https://yosmhm.neis-one.org/?u=Kachkaev&zoom=3&lat=50&lon=20&layers=B00TTF">
                {chunks}
              </a>
            ),
          })}
    </KeyProfile>
  );
}

async function Twitter() {
  const locale = await getLocale();
  const t = await getTranslations("index");

  const tweetCountEn = readCount(
    await readProfileInfo("twitter-en"),
    "tweetCount",
  );
  const tweetCountRu = readCount(
    await readProfileInfo("twitter-ru"),
    "tweetCount",
  );

  const urlEn = "https://twitter.com/kachkaev";
  const urlRu = "https://twitter.com/kachkaev_ru";

  const isEn = locale === "en";
  const tweetCount = isEn ? tweetCountEn : tweetCountRu;
  const otherTweetCount = isEn ? tweetCountRu : tweetCountEn;

  return (
    <KeyProfile name={t("profiles.twitter.name")} url={isEn ? urlEn : urlRu}>
      {tweetCount === undefined || otherTweetCount === undefined
        ? undefined
        : t.rich("profiles.twitter.description", {
            tweetCount,
            otherTweetCount,
            other: (chunks) => <a href={isEn ? urlRu : urlEn}>{chunks}</a>,
          })}
    </KeyProfile>
  );
}

function shuffle<T extends unknown[] | undefined>(array: T): T {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Needed for overloading
  return array?.toSorted(() => Math.random() - 0.5) as T;
}

async function Flickr() {
  const t = await getTranslations("index");
  const profileInfo = await readProfileInfo("flickr");
  const photoCount = readCount(profileInfo, "photoCount");

  const shuffledPhotos = shuffle(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TODO: use zod instead of type assertions
    profileInfo?.["mostViewedPhotos"] as
      Array<{ title: string; url: string; thumbnailUrl: string }> | undefined,
  );

  return (
    <>
      <KeyProfile
        name={t("profiles.flickr.name")}
        url="https://www.flickr.com/people/kachkaev"
      >
        {photoCount === undefined
          ? undefined
          : t("profiles.flickr.description", { photoCount })}
      </KeyProfile>
      {shuffledPhotos && (
        <div className="relative -mt-2 h-[50px] overflow-hidden rounded-[5px] bg-gray-300 bg-clip-padding">
          <div className="absolute whitespace-nowrap">
            {shuffledPhotos.map(({ thumbnailUrl, title, url }) => (
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
    </>
  );
}

export function KeyProfiles() {
  return (
    <>
      <Openaccess />
      <LinkedIn />
      <GitHub />
      <Osm />
      <Twitter />
      <Flickr />
    </>
  );
}
