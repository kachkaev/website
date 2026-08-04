import { connection } from "next/server";
import { useLocale, useTranslations } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import * as React from "react";

import { cn } from "../shared/cn";
import { readProfileInfo } from "../shared/profile-infos";

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
  const profileInfo = await readProfileInfo("openaccess");

  if (!profileInfo) {
    return descriptionPlaceholder;
  }

  return t.rich("profiles.openaccess.description", {
    paperCount: profileInfo.paperCount,
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
  const profileInfo = await readProfileInfo("linkedin");

  if (!profileInfo) {
    return descriptionPlaceholder;
  }

  return t("profiles.linkedin.description", {
    connectionCount: profileInfo.connectionCount,
  });
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
  const profileInfo = await readProfileInfo("github");

  if (!profileInfo) {
    return descriptionPlaceholder;
  }

  return t.rich("profiles.github.description", {
    repoCount: profileInfo.repoCount,
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

  if (!profileInfo) {
    return descriptionPlaceholder;
  }

  return t.rich("profiles.osm.description", {
    changesetCount: profileInfo.changesetCount,
    gpsTraceCount: profileInfo.gpsTraceCount,
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

  const profileInfoEn = await readProfileInfo("twitter-en");
  const profileInfoRu = await readProfileInfo("twitter-ru");

  const inEn = locale === "en";
  const profileInfo = inEn ? profileInfoEn : profileInfoRu;
  const otherProfileInfo = inEn ? profileInfoRu : profileInfoEn;

  if (!profileInfo || !otherProfileInfo) {
    return descriptionPlaceholder;
  }

  return t.rich("profiles.twitter.description", {
    tweetCount: profileInfo.tweetCount,
    otherTweetCount: otherProfileInfo.tweetCount,
    other: (chunks) => (
      <a href={inEn ? twitterUrlRu : twitterUrlEn}>{chunks}</a>
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

function shuffle<T>(array: readonly T[]): T[] {
  return array.toSorted(() => Math.random() - 0.5);
}

async function FlickrDescription() {
  const t = await getTranslations("index");
  const profileInfo = await readProfileInfo("flickr");

  if (!profileInfo) {
    return descriptionPlaceholder;
  }

  return t("profiles.flickr.description", {
    photoCount: profileInfo.photoCount,
  });
}

const photoStripClassName = cn(
  "relative -mt-2 h-[50px] overflow-hidden rounded-[5px] bg-gray-300 bg-clip-padding",
);

/** Preserves the height of the photo strip while it is loading or missing */
const photosPlaceholder = <div className={photoStripClassName} />;

async function FlickrPhotos() {
  // Photos are shuffled on each request, which requires a random seed
  await connection();

  const profileInfo = await readProfileInfo("flickr");

  if (!profileInfo) {
    return photosPlaceholder;
  }

  const shuffledPhotos = shuffle(profileInfo.mostViewedPhotos);

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
