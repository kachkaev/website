import "../../styles/globals.css";

import type { Locale } from "../../i18n-config";
import LocaleSwitcher from "./layout/locale-switcher";

export default async function Root({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return (
    <html lang={params.lang}>
      <body className="relative flex h-full w-full flex-col overflow-y-scroll px-5 py-4">
        <LocaleSwitcher />
        <div className="center flex grow flex-row self-center align-middle">
          <div className="min-[480]:w-[480px] max-w-[480px] self-center align-middle">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
