import "./styles.css";

import type { Metadata } from "next";

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
        <div className="flex w-full min-w-[260px] max-w-[450px] grow self-center">
          <div className="w-full self-center pb-6">{children}</div>
        </div>
      </body>
    </html>
  );
}

export function generateMetadata(): Metadata {
  /* @todo https://beta.nextjs.org/docs/api-reference/metadata
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#ffffff" />
  <meta name="msapplication-config" content="/browserconfig.xml" />
  */

  return {
    icons: {
      apple: "/favicon/apple-touch-icon.png",
      icon: [
        {
          sizes: "32x32",
          url: "/favicon/favicon-32x32.png",
        },
        {
          sizes: "16x16",
          url: "/favicon/favicon-16x16.png",
        },
      ],
      other: [
        {
          rel: "msapplication-config",
          url: "/browserconfig.xml",
        },
      ],
      shortcut: "/favicon.ico",
    },
    manifest: "/manifest.json",
    themeColor: "#ffffff",
  };
}

export const dynamic = "force-dynamic";
