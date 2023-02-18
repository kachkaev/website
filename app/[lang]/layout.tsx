import "../../styles/globals.css";

import { i18n } from "../../i18n-config";
import LocaleSwitcher from "./components/locale-switcher";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function Root({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <body>
        <LocaleSwitcher />
        {children}
      </body>
    </html>
  );
}
