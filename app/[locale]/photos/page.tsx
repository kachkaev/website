import type { Metadata } from "next";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { Mailto } from "../shared/mailto";

function PhotoSample({ alt }: { alt: string }) {
  return (
    <a
      className="group relative mx-auto mb-6 block w-full overflow-hidden rounded-[4px]"
      href="https://www.flickr.com/photos/kachkaev/7511763574/"
    >
      <img
        className="inline-block aspect-450/298 w-full align-middle grayscale hover:grayscale-0 active:grayscale-0"
        alt={alt}
        src="https://farm8.staticflickr.com/7247/7511763574_d528f4ce04_z_d.jpg"
      />
      <span className="absolute right-6 bottom-[.5rem] size-0 origin-bottom-left -rotate-90 overflow-visible text-sm whitespace-nowrap text-white! opacity-80 shadow-md drop-shadow-md">
        kachkaev.ru/photos
      </span>
      <span className="absolute inset-x-0 bottom-0 block group-hover:border-t-2 group-hover:border-t-red-500" />
    </a>
  );
}

export default function Page() {
  const locale = useLocale();
  const t = useTranslations("photos");
  const tCommon = useTranslations("common");

  return (
    <>
      <h1>{t("h1")}</h1>
      <PhotoSample alt={t("photoAlt")} />
      <p>
        {t.rich("explanation", {
          flickr: (chunks) => (
            <a href="https://www.flickr.com/people/kachkaev">{chunks}</a>
          ),
        })}
      </p>
      <ul className="ml-4">
        <li>
          {t.rich("hints.license", {
            cc: (chunks) => (
              <a href={`https://${locale}.wikipedia.org/wiki/Creative_Commons`}>
                {chunks}
              </a>
            ),
          })}
        </li>
        <li>{t("hints.exif")}</li>
        <li>
          {t.rich("hints.contact", {
            email: (chunks) => <Mailto>{chunks}</Mailto>,
          })}
        </li>
      </ul>
      <div>
        <Link href="/">{tCommon("signature")}</Link>
      </div>
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("photos");

  return { title: t("title") };
}
