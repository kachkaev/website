import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { Shell } from "./[locale]/layout/shell";
import { Mailto } from "./[locale]/shared/mailto";

/**
 * Rendered for any pathname that does not match a page.
 * This route is outside the [locale] segment, so it comes with its own HTML document.
 * The locale is resolved by the request host (see i18n/request.ts).
 */
export default function NotFound() {
  const t = useTranslations("error");
  const tCommon = useTranslations("common");

  return (
    <Shell>
      <h1>{t("h1")}</h1>
      <p>
        {t.rich("explanation", {
          email: (chunks) => <Mailto>{chunks}</Mailto>,
          issue: (chunks) => (
            <a href="https://github.com/kachkaev/website/issues">{chunks}</a>
          ),
        })}
      </p>
      <div>
        <Link href="/">{tCommon("signature")}</Link>
      </div>
    </Shell>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("error");

  return { title: t("title") };
}

/**
 * There is no [locale] segment to prerender this route for, so the whole document
 * (including `lang` and the messages) depends on the request host
 */
export const instant = false;
