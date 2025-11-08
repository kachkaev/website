import type * as React from "react";

import type { LocaleParam } from "../../../i18n-config";

export function Mailto({
  locale,
  children,
}: {
  locale: LocaleParam;
  children?: React.ReactNode;
}) {
  const email =
    locale === "en" ? "alexander@kachkaev.uk" : "alexander@kachkaev.ru";

  return <a href={`mailto:${email}`}>{children ?? email}</a>;
}
