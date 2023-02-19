"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { i18n } from "../../../i18n-config";

export default function LocaleSwitcher() {
  const pathName = usePathname();
  const redirectedPathName = (locale: string) => {
    if (!pathName) {
      return "/";
    }
    const segments = pathName.split("/");
    segments[1] = locale;

    return segments.join("/");
  };

  return (
    <div className="self-end leading-3">
      <ul>
        {i18n.locales.map((locale) => {
          return (
            <li key={locale} className="ml-3 inline-block">
              <Link href={redirectedPathName(locale)}>{locale}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
