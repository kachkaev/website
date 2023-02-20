import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { baseUrlRu } from "./i18n-server";

function geRequestHost(request: NextRequest) {
  return request.headers.get("x-forwarded-host") || request.headers.get("host");
}

const hostRu = new URL(baseUrlRu).host;

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

  newUrl.pathname = `/${hostRu === geRequestHost(request) ? "ru" : "en"}${
    newUrl.pathname
  }`;

  return NextResponse.rewrite(newUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon/).*)"],
};
