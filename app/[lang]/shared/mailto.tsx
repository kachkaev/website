import * as React from "react";

import type { Locale } from "../../../i18n-config";

export default function Mailto({
  lang,
  children,
}: {
  lang: Locale;
  children?: React.ReactNode;
}) {
  const email =
    lang === "en" ? "alexander@kachkaev.uk" : "alexander@kachkaev.ru";

  return <a href={`mailto:${email}`}>{children ?? email}</a>;
}
