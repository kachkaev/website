export const i18n = {
  defaultLocale: "en",
  locales: ["en", "ru"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
export type LocaleParam = string;
export type Dictionary = typeof import("./dictionaries/en.json");
