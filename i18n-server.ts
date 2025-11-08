// @todo Bring back the import when middleware.ts stops crashing because of that
// import "server-only";

import { i18n, type Locale } from "./i18n-config";

const dictionaryLookup = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ru: () => import("./dictionaries/ru.json").then((module) => module.default),
};

export async function getDictionary(locale: string) {
  // Locale may be equal to any value if matcher in middleware.ts returns false

  if (Object.hasOwn(dictionaryLookup, locale)) {
    return dictionaryLookup[
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- protected by Object.hasOwn
      locale as Locale
    ]();
  }

  return dictionaryLookup[i18n.defaultLocale]();
}

export const baseUrlByLocale: Record<Locale, string> = {
  en: process.env["BASE_URL_EN"] || "http://localhost:3000",
  ru: process.env["BASE_URL_RU"] || "http://ru.localhost:3000",
};
