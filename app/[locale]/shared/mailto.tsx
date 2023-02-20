import * as React from "react";

import type { Locale } from "../../../i18n-config";

export default function Mailto({
  locale,
  children,
}: {
  locale: Locale;
  children?: React.ReactNode;
}) {
  const email =
    locale === "en" ? "alexander@kachkaev.uk" : "alexander@kachkaev.ru";

  return <a href={`mailto:${email}`}>{children ?? email}</a>;
}
