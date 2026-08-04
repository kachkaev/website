import { baseUrlByLocale } from "../../../i18n/base-urls";
import { LocaleSwitcherInner } from "./locale-switcher-inner";

export function LocaleSwitcher() {
  return <LocaleSwitcherInner baseUrlByLocale={baseUrlByLocale} />;
}
