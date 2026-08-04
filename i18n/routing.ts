import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "en",
  locales: ["en", "ru"],

  // Each locale is served from its own domain (see proxy.ts), so URLs never contain a locale prefix
  localePrefix: "never",

  // The domain fully determines the locale, so there is nothing to detect or to remember
  localeCookie: false,
  localeDetection: false,
});
