import createMiddleware from "next-intl/middleware";

import { baseUrlByLocale } from "./i18n/base-urls";
import { routing } from "./i18n/routing";

export const proxy = createMiddleware({
  ...routing,

  // Each locale lives on its own domain, e.g. kachkaev.uk (en) and kachkaev.ru (ru)
  domains: routing.locales.map((locale) => ({
    defaultLocale: locale,
    domain: new URL(baseUrlByLocale[locale]).host,
    locales: [locale],
  })),
});

export const config = {
  // Paths with a file extension are served as they are (favicons, manifest.json, robots.txt, images)
  // eslint-disable-next-line unicorn/prefer-string-raw -- Next.js statically analyses this value, so it has to be a plain string literal
  matcher: "/((?!_next|.*\\..*).*)",
};
