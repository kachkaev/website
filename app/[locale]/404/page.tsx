import type { Metadata } from "next";
import Link from "next/link";

import { getDictionary } from "../../../get-dictionary";
import type { Locale } from "../../../i18n-config";
import Mailto from "../shared/mailto";

interface PageProps {
  params: { locale: Locale };
}

export default async function Page({ params: { locale } }: PageProps) {
  const dictionary = await getDictionary(locale);

  return (
    <>
      <h1>{dictionary.error.h1}</h1>
      <p>
        {dictionary.error["explanation.1"]}
        <Mailto locale={locale}>{dictionary.error["explanation.2"]}</Mailto>
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
  params: { locale },
}: PageProps): Promise<Metadata> {
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.error.title,
  };
}
