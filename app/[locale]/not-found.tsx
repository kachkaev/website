import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

import { Mailto } from "./shared/mailto";

export default function NotFound() {
  const t = useTranslations("error");
  const tCommon = useTranslations("common");

  return (
    <>
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
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("error");

  return { title: t("title") };
}
