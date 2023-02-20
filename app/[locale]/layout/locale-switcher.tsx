import type { Locale } from "../../../i18n-config";
import { baseUrlByLocale } from "../../../i18n-server";
import LocaleSwitcherInner from "./locale-switcher-inner";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  return (
    <LocaleSwitcherInner locale={locale} baseUrlByLocale={baseUrlByLocale} />
  );
}
