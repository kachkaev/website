import "../styles.css";

import { NextIntlClientProvider, useLocale } from "next-intl";
import * as React from "react";

import { GoogleAnalytics } from "./google-analytics";
import { LocaleSwitcher } from "./locale-switcher";
import { ProgressProvider } from "./progress-provider";

/**
 * Wraps page contents into an HTML document.
 * Used by layout.tsx as well as by global-not-found.tsx, which is outside the [locale] segment.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  return (
    <html lang={locale}>
      <body
        className={`relative flex size-full flex-col overflow-y-scroll px-5 pt-4 ${locale}`}
      >
        {/* Messages are only used in server components, so they are kept out of the client payload */}
        <NextIntlClientProvider
          // eslint-disable-next-line unicorn/no-null -- `undefined` would mean ‘inherit all messages from the server’
          messages={null}
        >
          <ProgressProvider>
            <React.Suspense>
              <GoogleAnalytics />
            </React.Suspense>
            <LocaleSwitcher />
            <div className="flex w-full max-w-[450px] min-w-[260px] grow self-center">
              <div className="w-full self-center pb-6">{children}</div>
            </div>
          </ProgressProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
