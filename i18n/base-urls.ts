import "server-only";

import type { Locale } from "next-intl";

import { serverEnv } from "../app/[locale]/shared/server-env";

export const baseUrlByLocale: Record<Locale, string> = {
  en: serverEnv.BASE_URL_EN,
  ru: serverEnv.BASE_URL_RU,
};
