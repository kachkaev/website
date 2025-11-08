import { type NextRequest, NextResponse } from "next/server";

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

export function proxy(request: NextRequest): NextResponse {
  const newUrl = new URL(request.url);

  if (["/manifest.json", "/robots.txt"].includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (
    i18n.locales.some((locale) => newUrl.pathname.startsWith(`/${locale}/`))
  ) {
    newUrl.pathname.slice(3);

    return NextResponse.redirect(newUrl);
  }

  const locale =
    localeByHost[geRequestHost(request) ?? ""] ?? i18n.defaultLocale;

  // @todo Remove when catch-all ‘not found’ pages are implemented
  const existingPathnamePatterns = [
    /^\/$/,
    /^\/photos$/,
    /^\/update-profiles\//,
  ];
  if (
    !existingPathnamePatterns.some((pathnamePattern) =>
      pathnamePattern.test(newUrl.pathname),
    )
  ) {
    newUrl.pathname = `/${locale}/404`;

    return NextResponse.rewrite(newUrl, { status: 404 });
  }

  newUrl.pathname = `/${locale}${newUrl.pathname}`;

  return NextResponse.rewrite(newUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|apple-icon|favicon|icon|images/).*)",
  ],
};
