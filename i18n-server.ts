import "server-only";

import { serverEnv } from "./app/[locale]/shared/server-env";
import { type Dictionary, i18n, type Locale } from "./i18n-config";

const dictionaryLookup = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  ru: () => import("./dictionaries/ru.json").then((module) => module.default),
};

export async function getDictionary(locale: string): Promise<Dictionary> {
  // Locale may be equal to any value if matcher in proxy.ts returns false

  if (Object.hasOwn(dictionaryLookup, locale)) {
    return dictionaryLookup[
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- protected by Object.hasOwn
      locale as Locale
    ]();
  }

  return dictionaryLookup[i18n.defaultLocale]();
}

export const baseUrlByLocale: Record<Locale, string> = {
  en: serverEnv.BASE_URL_EN,
  ru: serverEnv.BASE_URL_RU,
};
