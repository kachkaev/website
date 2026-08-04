"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { hasLocale, type Locale, useLocale } from "next-intl";
import * as React from "react";

import { routing } from "../../../i18n/routing";

const localeHighlightLocalStorageKey = "hideLocaleHighlightUntil";

function LocaleHighlighter() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let tick = 1;
    const interval = setInterval(() => {
      if (tick > 3) {
        setVisible((value) => !value);
      }
      tick += 1;
      if (tick === 10) {
        clearInterval(interval);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!visible) {
    return;
  }

  return (
    <span className="pointer-events-none absolute inset-1/2 align-middle">
      <span className="absolute -top-5 -left-5 size-10 rounded-full bg-blue-400 opacity-25 group-visited:bg-violet-400 group-hover:bg-red-400 group-active:bg-red-400 dark:group-visited:bg-violet-300" />
    </span>
  );
}

function stopHighlightingLocaleForSomeTime() {
  try {
    localStorage.setItem(
      localeHighlightLocalStorageKey,
      `${Date.now() + 24 * 60 * 60 * 1000 /* one day */}`,
    );
  } catch {
    // noop (handling unavailable localStorage in private tabs)
  }
}

function LocaleSwitcherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mt-4 -mr-5 -mb-10 -ml-10 self-end overflow-hidden pt-4 pr-5 pb-10 pl-10 leading-3">
      <ul>{children}</ul>
    </div>
  );
}

function LocaleListItem({
  locale,
  href,
  highlighted,
  onStopHighlighting,
}: {
  href?: string | undefined;
  locale: string;
  highlighted?: boolean;
  onStopHighlighting?: () => void;
}) {
  return (
    <li className="-mt-3 -mr-3 inline-block">
      {href ? (
        <Link
          className="group relative inline-block border-none p-3"
          href={href}
          onClick={() => {
            onStopHighlighting?.();
          }}
        >
          {highlighted && <LocaleHighlighter />}
          <span className="border-b border-inherit">{locale}</span>
        </Link>
      ) : (
        <span className="inline-block p-3">{locale}</span>
      )}
    </li>
  );
}

export function LocaleSwitcherInner({
  baseUrlByLocale,
}: {
  baseUrlByLocale: Record<Locale, string>;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const stringifiedSearchParams = useSearchParams().toString();

  const [highlightedLocale, setHighlightedLocale] = React.useState<
    string | undefined
  >();

  React.useEffect(() => {
    const localeToHighlight = navigator.languages
      .map((language) => language.slice(0, 2))
      .find((language) => hasLocale(routing.locales, language));

    if (localeToHighlight && localeToHighlight !== locale) {
      try {
        const highlightHiddenUntil = Number.parseInt(
          localStorage.getItem(localeHighlightLocalStorageKey) ?? "0",
          10,
        );
        if (highlightHiddenUntil > Date.now()) {
          stopHighlightingLocaleForSomeTime();
        } else {
          // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect, react-hooks/set-state-in-effect -- intended use (setting state based on navigator API data)
          setHighlightedLocale(localeToHighlight);
        }
      } catch {
        // noop (handling unavailable localStorage in private tabs)
      }
    }
  }, [locale]);

  return (
    <LocaleSwitcherLayout>
      {routing.locales.map((currentLocale) => {
        return (
          <LocaleListItem
            key={currentLocale}
            locale={currentLocale}
            href={
              locale === currentLocale
                ? undefined
                : `${baseUrlByLocale[currentLocale]}${pathname}${
                    stringifiedSearchParams ? `?${stringifiedSearchParams}` : ""
                  }`
            }
            highlighted={currentLocale === highlightedLocale}
            onStopHighlighting={stopHighlightingLocaleForSomeTime}
          />
        );
      })}
    </LocaleSwitcherLayout>
  );
}

/**
 * Reserves the space taken by the locale switcher until the links are ready
 */
export function LocaleSwitcherPlaceholder() {
  return (
    <LocaleSwitcherLayout>
      {routing.locales.map((currentLocale) => (
        <LocaleListItem key={currentLocale} locale={currentLocale} />
      ))}
    </LocaleSwitcherLayout>
  );
}
