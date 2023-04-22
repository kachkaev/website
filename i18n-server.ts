// @todo Bring back the import when middleware.ts stops crashing because of that
// import "server-only";

import { type Locale } from "./i18n-config";
import { i18n } from "./i18n-config";

const dictionaryLookup = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ru: () => import("./dictionaries/ru.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  // Locale may be equal to any value if matcher in middleware.ts returns false

  if (locale in dictionaryLookup) {
    return dictionaryLookup[locale as Locale]();
  }

  return dictionaryLookup[i18n.defaultLocale]();
};

export const baseUrlByLocale: Record<Locale, string> = {
  en: process.env["BASE_URL_EN"] || "http://localhost:3000",
  ru: process.env["BASE_URL_RU"] || "http://ru.localhost:3000",
};
