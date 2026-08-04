import "../styles.css";

import Script from "next/script";
import { NextIntlClientProvider, useLocale } from "next-intl";

import { serverEnv } from "../shared/server-env";
import { LocaleSwitcher } from "./locale-switcher";
import { ProgressProvider } from "./progress-provider";

/**
 * Wraps page contents into an HTML document.
 * Used by layout.tsx as well as by not-found.tsx, which is outside the [locale] segment.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  const gaMeasurementId = serverEnv.GA_MEASUREMENT_ID;

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
            {gaMeasurementId ? (
              <>
                <Script
                  async={true}
                  src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
                  strategy="afterInteractive"
                />
                <Script
                  id="google-analytics"
                  strategy="afterInteractive"
                >{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaMeasurementId}');`}</Script>
              </>
            ) : undefined}
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
