// @todo Bring back the import when middleware.ts stops crashing because of that
// import "server-only";

import type { Locale } from "./i18n-config";

const dictionaryLookup = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ru: () => import("./dictionaries/ru.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaryLookup[locale]();

export const baseUrlByLocale: Record<Locale, string> = {
  ru: process.env["BASE_URL_RU"] || "http://ru.localhost:3000",
  en: process.env["BASE_URL_EN"] || "http://localhost:3000",
};
