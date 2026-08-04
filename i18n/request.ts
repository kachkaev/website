import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

const messagesByLocale = {
  en: () => import("../messages/en.json"),
  ru: () => import("../messages/ru.json"),
};

// eslint-disable-next-line import/no-default-export -- required by next-intl
export default getRequestConfig(async ({ locale: explicitLocale }) => {
  // An explicit locale is only present when it is passed to an awaitable API,
  // e.g. getTranslations({ locale }). Otherwise it comes from the [locale] segment.
  const locale = explicitLocale ?? (await rootParams.locale());

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const { default: messages } = await messagesByLocale[locale]();

  return { locale, messages };
});
