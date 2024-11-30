// // src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, isValidLocale, type SupportedLanguages } from "@/i18n/types";

const cookieName = "i18nlang";

function parseAcceptLanguage(acceptLanguage: string | null): SupportedLanguages {
  if (!acceptLanguage) return defaultLocale;
  try {
    const preferredLocale = acceptLanguage
      .split(",")[0]
      .split("-")[0]
      .toLowerCase();
    return isValidLocale(preferredLocale) ? preferredLocale : defaultLocale;
  } catch {
    return defaultLocale;
  }
}

function getLocale(request: NextRequest): SupportedLanguages {
  // Check cookie first
  if (request.cookies.has(cookieName)) {
    const cookieValue = request.cookies.get(cookieName)!.value;
    if (isValidLocale(cookieValue)) return cookieValue;
  }
  return parseAcceptLanguage(request.headers.get("Accept-Language"));
}

export function middleware(request: NextRequest) {
  // Skip Next.js internal routes
  if (request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Handle language switch requests
  if (pathname.startsWith('/lang/')) {
    const newLocale = pathname.split('/')[2];
    if (isValidLocale(newLocale)) {
      // Remove /lang/[locale] and get the rest of the path
      const targetPath = pathname.replace(/^\/lang\/[^/]+/, '') || '/';
      const response = NextResponse.redirect(new URL(
        newLocale === defaultLocale ? targetPath : `/${newLocale}${targetPath}`,
        request.url
      ));
      response.cookies.set(cookieName, newLocale);
      return response;
    }
  }
  
  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // For paths without a locale, use the stored/default locale
  const locale = getLocale(request);
  
  if (locale === defaultLocale) {
    // For default locale, rewrite internally but keep URL clean
    const response = NextResponse.rewrite(new URL(`/${defaultLocale}${pathname}`, request.url));
    response.cookies.set(cookieName, defaultLocale);
    return response;
  }

  // For non-default locale, redirect to add prefix
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(cookieName, locale);
  return response;
}

export const config = {
  matcher: ["/((?!_next).*)"],
};
