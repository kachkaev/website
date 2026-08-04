import { connection } from "next/server";
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import * as React from "react";

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

/** Preserves the height of a profile description while it is loading or missing */
const descriptionPlaceholder = <>&nbsp;</>;

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
      {/* Descriptions are based on profile infos, which are only available at runtime */}
      <p className="mt-px mb-3 opacity-60">
        <React.Suspense fallback={descriptionPlaceholder}>
          {children}
        </React.Suspense>
      </p>
    </>
  );
}

async function OpenaccessDescription() {
  const t = await getTranslations("index");
  const paperCount = readCount(
    await readProfileInfo("openaccess"),
    "paperCount",
  );

  if (paperCount === undefined) {
    return descriptionPlaceholder;
  }

  return t.rich("profiles.openaccess.description", {
    paperCount,
    thesis: (chunks) => (
      <a href="https://openaccess.city.ac.uk/12460/">{chunks}</a>
    ),
  });
}

function Openaccess() {
  const t = useTranslations("index");

  return (
    <KeyProfile
      name={t("profiles.openaccess.name")}
      url="https://openaccess.city.ac.uk/view/creators/Kachkaev=3AA=2E=3A=3A.html"
    >
      <OpenaccessDescription />
    </KeyProfile>
  );
}

async function LinkedInDescription() {
  const t = await getTranslations("index");
  const connectionCount = readCount(
    await readProfileInfo("linkedin"),
    "connectionCount",
  );

  if (connectionCount === undefined) {
    return descriptionPlaceholder;
  }

  return t("profiles.linkedin.description", { connectionCount });
}

function LinkedIn() {
  const t = useTranslations("index");

  return (
    <KeyProfile
      name={t("profiles.linkedin.name")}
      url="https://www.linkedin.com/in/kachkaev/"
    >
      <LinkedInDescription />
    </KeyProfile>
  );
}

async function GitHubDescription() {
  const t = await getTranslations("index");
  const repoCount = readCount(await readProfileInfo("github"), "repoCount");

  if (repoCount === undefined) {
    return descriptionPlaceholder;
  }

  return t.rich("profiles.github.description", {
    repoCount,
    website: (chunks) => (
      <a href="https://github.com/kachkaev/website">{chunks}</a>
    ),
  });
}

function GitHub() {
  const t = useTranslations("index");

  return (
    <KeyProfile
      name={t("profiles.github.name")}
      url="https://github.com/kachkaev"
    >
      <GitHubDescription />
    </KeyProfile>
  );
}

async function OsmDescription() {
  const t = await getTranslations("index");
  const profileInfo = await readProfileInfo("osm");
  const changesetCount = readCount(profileInfo, "changesetCount");
  const gpsTraceCount = readCount(profileInfo, "gpsTraceCount");

  if (changesetCount === undefined || gpsTraceCount === undefined) {
    return descriptionPlaceholder;
  }

  return t.rich("profiles.osm.description", {
    changesetCount,
    gpsTraceCount,
    hdyc: (chunks) => (
      <a href="https://yosmhm.neis-one.org/?u=Kachkaev&zoom=3&lat=50&lon=20&layers=B00TTF">
        {chunks}
      </a>
    ),
  });
}

function Osm() {
  const t = useTranslations("index");

  return (
    <KeyProfile
      name={t("profiles.osm.name")}
      url="https://www.openstreetmap.org/user/Kachkaev"
    >
      <OsmDescription />
    </KeyProfile>
  );
}

const twitterUrlEn = "https://twitter.com/kachkaev";
const twitterUrlRu = "https://twitter.com/kachkaev_ru";

async function TwitterDescription() {
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

  const isEn = locale === "en";
  const tweetCount = isEn ? tweetCountEn : tweetCountRu;
  const otherTweetCount = isEn ? tweetCountRu : tweetCountEn;

  if (tweetCount === undefined || otherTweetCount === undefined) {
    return descriptionPlaceholder;
  }

  return t.rich("profiles.twitter.description", {
    tweetCount,
    otherTweetCount,
    other: (chunks) => (
      <a href={isEn ? twitterUrlRu : twitterUrlEn}>{chunks}</a>
    ),
  });
}

function Twitter() {
  const locale = useLocale();
  const t = useTranslations("index");

  return (
    <KeyProfile
      name={t("profiles.twitter.name")}
      url={locale === "en" ? twitterUrlEn : twitterUrlRu}
    >
      <TwitterDescription />
    </KeyProfile>
  );
}

function shuffle<T extends unknown[] | undefined>(array: T): T {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Needed for overloading
  return array?.toSorted(() => Math.random() - 0.5) as T;
}

async function FlickrDescription() {
  const t = await getTranslations("index");
  const photoCount = readCount(await readProfileInfo("flickr"), "photoCount");

  if (photoCount === undefined) {
    return descriptionPlaceholder;
  }

  return t("profiles.flickr.description", { photoCount });
}

const photoStripClassName =
  "relative -mt-2 h-[50px] overflow-hidden rounded-[5px] bg-gray-300 bg-clip-padding";

/** Preserves the height of the photo strip while it is loading or missing */
const photosPlaceholder = <div className={photoStripClassName} />;

async function FlickrPhotos() {
  // Photos are shuffled on each request, which requires a random seed
  await connection();

  const profileInfo = await readProfileInfo("flickr");

  const shuffledPhotos = shuffle(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- TODO: use zod instead of type assertions
    profileInfo?.["mostViewedPhotos"] as
      Array<{ title: string; url: string; thumbnailUrl: string }> | undefined,
  );

  if (!shuffledPhotos) {
    return photosPlaceholder;
  }

  return (
    <div className={photoStripClassName}>
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
  );
}

function Flickr() {
  const t = useTranslations("index");

  return (
    <>
      <KeyProfile
        name={t("profiles.flickr.name")}
        url="https://www.flickr.com/people/kachkaev"
      >
        <FlickrDescription />
      </KeyProfile>
      <React.Suspense fallback={photosPlaceholder}>
        <FlickrPhotos />
      </React.Suspense>
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
