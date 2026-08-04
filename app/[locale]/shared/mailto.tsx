import { useTranslations } from "next-intl";
import type * as React from "react";

export function Mailto({ children }: { children?: React.ReactNode }) {
  const email = useTranslations("common")("email");

  return <a href={`mailto:${email}`}>{children ?? email}</a>;
}
