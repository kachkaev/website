import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { getLocaleByHost } from "./locale-by-host";
import { routing } from "./routing";

const messagesByLocale = {
  en: () => import("../messages/en.json"),
  ru: () => import("../messages/ru.json"),
};

// eslint-disable-next-line import/no-default-export -- required by next-intl
export default getRequestConfig(async ({ locale: explicitLocale }) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- root params are typed as always defined, but they are unavailable in routes that are outside the [locale] segment, e.g. global-not-found.tsx
  const localeFromRootParams = (await rootParams.locale()) as
    string | undefined;

  // An explicit locale is only present when it is passed to an awaitable API,
  // e.g. getTranslations({ locale })
  const locale =
    explicitLocale ?? localeFromRootParams ?? (await getLocaleByHost());

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const { default: messages } = await messagesByLocale[locale]();

  return { locale, messages };
});
