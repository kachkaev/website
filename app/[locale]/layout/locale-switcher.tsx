import type { LocaleParam } from "../../../i18n-config";
import { baseUrlByLocale } from "../../../i18n-server";
import { LocaleSwitcherInner } from "./locale-switcher-inner";

export function LocaleSwitcher({ locale }: { locale: LocaleParam }) {
  return (
    <LocaleSwitcherInner locale={locale} baseUrlByLocale={baseUrlByLocale} />
  );
}
