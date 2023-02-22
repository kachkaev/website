import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { i18n } from "./i18n-config";
import { baseUrlByLocale } from "./i18n-server";

function geRequestHost(request: NextRequest) {
  return request.headers.get("x-forwarded-host") || request.headers.get("host");
}

const localeByHost = Object.fromEntries(
  Object.entries(baseUrlByLocale).map(([locale, baseUrl]) => [
    new URL(baseUrl).host,
    locale,
  ]),
);

export function middleware(request: NextRequest) {
  const newUrl = new URL(request.url);

  if (
    ["/browserconfig.xml", "/manifest.json", "/robots.txt"].includes(
      request.nextUrl.pathname,
    )
  ) {
    return NextResponse.next();
  }

  if (
    newUrl.pathname.startsWith("/ru/") ||
    newUrl.pathname.startsWith("/en/")
  ) {
    newUrl.pathname.slice(3);

    return NextResponse.redirect(newUrl);
  }

  newUrl.pathname = `/${
    localeByHost[geRequestHost(request) ?? ""] ?? i18n.defaultLocale
  }${newUrl.pathname}`;

  return NextResponse.rewrite(newUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon/|images/).*)"],
};
