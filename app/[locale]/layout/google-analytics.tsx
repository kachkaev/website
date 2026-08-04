import Script from "next/script";
import { connection } from "next/server";

import { serverEnv } from "../shared/server-env";

export async function GoogleAnalytics() {
  // GA_MEASUREMENT_ID comes from an env var, which is only known at runtime
  await connection();

  const gaMeasurementId = serverEnv.GA_MEASUREMENT_ID;

  if (!gaMeasurementId) {
    return;
  }

  return (
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
  );
}
