import type { Metadata } from "next";
import Link from "next/link";

import { getDictionary } from "../../../get-dictionary";
import type { Locale } from "../../../i18n-config";
import Mailto from "../shared/mailto";

interface PageProps {
  params: { lang: Locale };
}

export default async function Page({ params: { lang } }: PageProps) {
  const dictionary = await getDictionary(lang);

  return (
    <>
      <h1>{dictionary.error.h1}</h1>
      <p>
        {dictionary.error["explanation.1"]}
        <Mailto lang={lang}>{dictionary.error["explanation.2"]}</Mailto>
        {dictionary.error["explanation.3"]}
        <a href="https://github.com/kachkaev/website/issues">
          {dictionary.error["explanation.4"]}
        </a>
        {dictionary.error["explanation.5"]}
      </p>
      <div>
        <Link href="/">{dictionary.common.signature}</Link>
      </div>
    </>
  );
}

export async function generateMetadata({
  params: { lang },
}: PageProps): Promise<Metadata> {
  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.error.title,
  };
}
