import "../../styles/globals.css";

import type { Locale } from "../../i18n-config";
import LocaleSwitcher from "./layout/locale-switcher";

export default async function Root({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html lang={lang}>
      <body
        className={`relative flex h-full w-full flex-col overflow-y-scroll px-5 pt-4 ${lang}`}
      >
        <LocaleSwitcher />
        <div className="flex w-full min-w-[260px] max-w-[500px] grow self-center">
          <div className="w-full self-center pb-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
