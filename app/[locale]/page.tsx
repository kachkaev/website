import type { Metadata } from "next";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import photo from "../../public/images/alexander_kachkaev.jpg";
import { KeyProfiles } from "./page/key-profiles";
import { Mailto } from "./shared/mailto";

export default function Page() {
  const locale = useLocale();
  const t = useTranslations("index");

  return (
    <>
      {/* Header */}
      <h1>
        {t("h1.firstName")}{" "}
        <span className="relative inline-block">
          {t("h1.lastName")}
          {locale === "en" && (
            <span className="absolute inset-x-0 bottom-[-20px] inline-block text-center text-[13px] font-normal opacity-60">
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
        <span>{t("intro.l1")}</span>{" "}
        <span>
          {t.rich("intro.l2", {
            gicentre: (chunks) => (
              <a
                href="https://www.gicentre.net/about"
                className="whitespace-nowrap"
              >
                {chunks}
              </a>
            ),
          })}
        </span>{" "}
        <span>{t("intro.l3")}</span>
      </p>

      {/* Photo */}
      <div className="float-right mt-1 mb-8 ml-8">
        <Image
          className="overflow-hidden rounded-[5px] bg-gray-300 text-gray-300"
          width={100}
          height={100}
          priority={true}
          alt={t("photoAlt")}
          src={photo}
        />
      </div>

      {/* Key profiles */}
      <KeyProfiles />

      {/* Misc profiles */}
      <div className="clear-both" />
      <div className="mt-6 text-center">
        <a className="mx-1" href="https://gitlab.com/kachkaev">
          {t("profiles.gitlab.name")}
        </a>{" "}
        <a className="mx-1" href="https://t.me/kachkaev">
          {t("profiles.telegram.name")}
        </a>{" "}
        <a className="mx-1" href="https://www.facebook.com/kachkaev">
          {t("profiles.facebook.name")}
        </a>{" "}
        {locale === "ru" && (
          <>
            {" "}
            <a className="mx-1" href="https://habr.com/users/kachkaev/">
              {t("profiles.habr.name")}
            </a>
            &nbsp;
            <a
              className="mx-1"
              href="https://ru.wikipedia.org/wiki/Участник:Kachkaev"
            >
              {t("profiles.wikipedia.name")}
            </a>
          </>
        )}{" "}
      </div>

      {/* Email */}
      <div className="mt-5 text-center">
        <Mailto />
        <div className="opacity-60">{t("emailRemark")}</div>
      </div>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("index");

  return {
    title: t("title"),
    description: t("description"),
  };
}
