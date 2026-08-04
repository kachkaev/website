import "server-only";

import { headers } from "next/headers";
import type { Locale } from "next-intl";

import { baseUrlByLocale } from "./base-urls";
import { routing } from "./routing";

const localeByHost: Record<string, Locale | undefined> = Object.fromEntries(
  routing.locales.map((locale) => [
    new URL(baseUrlByLocale[locale]).host,
    locale,
  ]),
);

/**
 * Resolves the locale the same way proxy.ts does.
 * Needed in routes that are outside the [locale] segment (e.g. not-found.tsx),
 * because next/root-params is unavailable there.
 */
export async function getLocaleByHost(): Promise<Locale> {
  const headerList = await headers();

  const host =
    (headerList.get("x-forwarded-host") ?? "") || headerList.get("host");

  return localeByHost[host ?? ""] ?? routing.defaultLocale;
}
