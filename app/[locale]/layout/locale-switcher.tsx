import { connection } from "next/server";
import * as React from "react";

import { baseUrlByLocale } from "../../../i18n/base-urls";
import {
  LocaleSwitcherInner,
  LocaleSwitcherPlaceholder,
} from "./locale-switcher-inner";

async function LocaleSwitcherLinks() {
  // Links depend on the current pathname and search params, as well as on base URLs,
  // which come from env vars that are only known at runtime
  await connection();

  return <LocaleSwitcherInner baseUrlByLocale={baseUrlByLocale} />;
}

export function LocaleSwitcher() {
  return (
    <React.Suspense fallback={<LocaleSwitcherPlaceholder />}>
      <LocaleSwitcherLinks />
    </React.Suspense>
  );
}
