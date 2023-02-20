"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { i18n, Locale } from "../../../i18n-config";

export default function LocaleSwitcherInner({
  locale,
  baseUrlByLocale,
}: {
  locale: Locale;
  baseUrlByLocale: Record<string, string>;
}) {
  const pathname = usePathname();
  const stringifiedSearchParams = useSearchParams().toString();

  return (
    <div className="self-end leading-3">
      <ul>
        {i18n.locales.map((currentLocale) => {
          return (
            <li key={currentLocale} className="ml-3 inline-block">
              {locale === currentLocale ? (
                currentLocale
              ) : (
                <Link
                  href={`${baseUrlByLocale[currentLocale]}${pathname}${
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
