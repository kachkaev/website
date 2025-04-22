import "./styles.css";

import Script from "next/script";

import type { Locale } from "../../i18n-config";
import LocaleSwitcher from "./layout/locale-switcher";
import NextAppNprogress from "./layout/next-app-nprogress";

export default async function Root(props: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  const gaMeasurementId = process.env["GA_MEASUREMENT_ID"];

  return (
    <html lang={locale}>
      <body
        className={`relative flex size-full flex-col overflow-y-scroll px-5 pt-4 ${locale}`}
      >
        <NextAppNprogress color="var(--nprogress-color)" />
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
        <LocaleSwitcher locale={locale} />
        <div className="flex w-full min-w-[260px] max-w-[450px] grow self-center">
          <div className="w-full self-center pb-6">{children}</div>
        </div>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";
