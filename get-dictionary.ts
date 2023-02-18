import "server-only";
import type { Locale } from "./i18n-config";

const dictionaryLookup = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  de: () => import("./dictionaries/de.json").then((module) => module.default),
  cs: () => import("./dictionaries/cs.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaryLookup[locale]();
