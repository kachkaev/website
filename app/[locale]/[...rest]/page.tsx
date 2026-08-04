import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

/**
 * Renders not-found.tsx for any pathname that does not match a page
 */
export default function Page(): never {
  notFound();
}

/**
 * Metadata in not-found.tsx only applies to the initial HTML response.
 * Because the page contents are rendered by the router after hydration,
 * the title has to be defined here too – otherwise it is lost.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("error");

  return { title: t("title") };
}
