import type { Metadata } from "next";
import Image from "next/image";

import type { Locale } from "../../i18n-config";
import { getDictionary } from "../../i18n-server";
import photo from "../../public/images/alexander_kachkaev.jpg";
import * as keyProfiles from "./page/key-profiles";
import Mailto from "./shared/mailto";

interface PageProps {
  params: { locale: Locale };
}

export default async function Page({ params: { locale } }: PageProps) {
  const dictionary = await getDictionary(locale);

  return (
    <>
      {/* Header */}
      <h1>
        {dictionary.index["h1.firstName"]}{" "}
        <span className="relative inline-block">
          {dictionary.index["h1.lastName"]}
          {locale === "en" && (
            <span className="absolute bottom-[-20px] left-0 right-0 inline-block text-center text-[13px] font-normal opacity-60">
              {" "}
              <span className="invisible">(</span>
              catch · ka ′ yev
              <span className="invisible">)</span>
            </span>
          )}
        </span>
      </h1>

      {/* Description */}
      <p className="description-on-index-page">
        <span>{dictionary.index["description.l1"]}</span>{" "}
        <span>
          {dictionary.index["description.l2.1"]}
          <a href="http://www.gicentre.net/" className="whitespace-nowrap">
            {dictionary.index["description.l2.2"]}
          </a>
          {dictionary.index["description.l2.3"]}
        </span>{" "}
        <span>{dictionary.index["description.l3"]}</span>
      </p>

      {/* Photo */}
      <div className="float-right mt-1 ml-8 mb-8">
        <Image
          className="overflow-hidden rounded-[5px] bg-gray-300 text-gray-300"
          width={100}
          height={100}
          alt={dictionary.index.photoAlt}
          src={photo}
        />
      </div>

      {/* Key profiles */}
      {/* @ts-expect-error -- server component https://github.com/vercel/next.js/issues/42292 */}
      <keyProfiles.Openaccess locale={locale} dictionary={dictionary} />
      {/* @ts-expect-error -- server component */}
      <keyProfiles.LinkedIn locale={locale} dictionary={dictionary} />
      {/* @ts-expect-error -- server component */}
      <keyProfiles.GitHub locale={locale} dictionary={dictionary} />
      {/* @ts-expect-error -- server component */}
      <keyProfiles.Osm locale={locale} dictionary={dictionary} />
      {/* @ts-expect-error -- server component */}
      <keyProfiles.Twitter locale={locale} dictionary={dictionary} />
      {/* @ts-expect-error -- server component */}
      <keyProfiles.Flickr locale={locale} dictionary={dictionary} />

      {/* Misc profiles */}
      <div className="clear-both" />
      <div className="mt-6 text-center">
        <a className="mx-1" href="https://gitlab.com/kachkaev">
          {dictionary.index["profiles.gitlab.name"]}
        </a>{" "}
        <a className="mx-1" href="https://t.me/kachkaev">
          {dictionary.index["profiles.telegram.name"]}
        </a>{" "}
        <a className="mx-1" href="https://www.facebook.com/kachkaev">
          {dictionary.index["profiles.facebook.name"]}
        </a>{" "}
        <a className="mx-1" href="https://vk.com/kachkaev">
          {dictionary.index["profiles.vk.name"]}
        </a>
        {locale === "ru" && (
          <>
            {" "}
            <a className="mx-1" href="https://habr.com/users/kachkaev/">
              {dictionary.index["profiles.habr.name"]}
            </a>
            &nbsp;
            <a
              className="mx-1"
              href="https://ru.wikipedia.org/wiki/Участник:Kachkaev"
            >
              {dictionary.index["profiles.wikipedia.name"]}
            </a>
          </>
        )}{" "}
      </div>

      {/* Email */}
      <div className="mt-5 text-center">
        <Mailto locale={locale} />
        <div className="opacity-60">{dictionary.index.emailRemark}</div>
      </div>
    </>
  );
}

export async function generateMetadata({
  params: { locale },
}: PageProps): Promise<Metadata> {
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.index.title,
    description: dictionary.index.description,
  };
}
