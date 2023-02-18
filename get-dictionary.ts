import "server-only";

import type { Locale } from "./i18n-config";

const dictionaryLookup = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ru: () => import("./dictionaries/ru.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaryLookup[locale]();
