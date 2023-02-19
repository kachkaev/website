import Link from "next/link";

import { getDictionary } from "../../../get-dictionary";
import { type Locale, i18n } from "../../../i18n-config";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

function PhotoSample({ alt }: { alt: string }) {
  return (
    <a
      className="group relative mx-auto mb-6 block w-full overflow-hidden rounded-[4px]"
      href="https://www.flickr.com/photos/kachkaev/7511763574/"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="inline-block w-full align-middle grayscale hover:grayscale-0 active:grayscale-0"
        alt={alt}
        src="https://farm8.staticflickr.com/7247/7511763574_d528f4ce04_z_d.jpg"
      />
      <span className="absolute right-[1.7rem] bottom-[0.3rem] h-0 w-0 origin-bottom-left -rotate-90 overflow-visible whitespace-nowrap text-white opacity-80 shadow-md drop-shadow-md">
        kachkaev.ru/photos
      </span>
      <span className="absolute inset-x-0 bottom-0 block group-hover:border-t-2 group-hover:border-t-red-500" />
    </a>
  );
}

interface PageProps {
  params: { lang: Locale };
}

export default async function Page({ params: { lang } }: PageProps) {
  const dictionary = await getDictionary(lang);

  return (
    <>
      <h1>{dictionary.photos.h1}</h1>
      <PhotoSample alt={dictionary.photos["photo.alt"]} />
      <p>
        {dictionary.photos["explanation.1"]}
        <a href="https://www.flickr.com/people/kachkaev">
          {dictionary.photos["explanation.2"]}
        </a>
        {dictionary.photos["explanation.3"]}
      </p>
      <ul className="ml-4">
        <li>
          {dictionary.photos["hint1.1"]}
          <a href={`https://${lang}.wikipedia.org/wiki/Creative_Commons`}>
            {dictionary.photos["hint1.2"]}
          </a>
          {dictionary.photos["hint1.3"]}
        </li>
        <li>{dictionary.photos.hint2}</li>
        <li>
          {dictionary.photos["hint3.1"]}
          <a href="mailto:alexander@kachkaev.ru">
            {dictionary.photos["hint3.2"]}
          </a>
          {dictionary.photos["hint3.3"]}
        </li>
      </ul>
      <div>
        <Link href="/">{dictionary.common.signature}</Link>
      </div>
    </>
  );
}

export async function generateMetadata({ params: { lang } }: PageProps) {
  const dictionary = await getDictionary(lang);

  return { title: dictionary.photos.title };
}
