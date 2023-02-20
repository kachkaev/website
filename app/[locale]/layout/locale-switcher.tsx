import type { Locale } from "../../../i18n-config";
import { baseUrlEn, baseUrlRu } from "../../../i18n-server";
import LocaleSwitcherInner from "./locale-switcher-inner";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  return (
    <LocaleSwitcherInner
      locale={locale}
      localeBaseUrlLookup={{
        en: baseUrlEn,
        ru: baseUrlRu,
      }}
    />
  );
}
