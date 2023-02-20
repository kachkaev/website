"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import type { Locale } from "../../../i18n-config";

export default function LocaleSwitcherInner({
  locale,
  localeBaseUrlLookup,
}: {
  locale: Locale;
  localeBaseUrlLookup: Record<string, string>;
}) {
  const pathname = usePathname();
  const stringifiedSearchParams = useSearchParams().toString();

  return (
    <div className="self-end leading-3">
      <ul>
        {Object.entries(localeBaseUrlLookup).map(([currentLocale, baseUrl]) => {
          return (
            <li key={currentLocale} className="ml-3 inline-block">
              {locale === currentLocale ? (
                currentLocale
              ) : (
                <Link
                  href={`${baseUrl}${pathname}${
                    stringifiedSearchParams ? `?${stringifiedSearchParams}` : ""
                  }`}
                >
                  {currentLocale}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
