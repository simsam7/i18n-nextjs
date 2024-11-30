// // src/middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// const locales = ["en", "af"] as const;
// type ValidLocale = typeof locales[number];
// const defaultLocale = "en";
// const cookieName = "i18nlang";

// // Validate if a string is a supported locale
// function isValidLocale(locale: string): locale is ValidLocale {
//   return locales.includes(locale as ValidLocale);
// }

// function parseAcceptLanguage(acceptLanguage: string | null): ValidLocale {
//   if (!acceptLanguage) return defaultLocale;

//   // Sanitize input - only allow standard Accept-Language characters
//   if (!/^[a-zA-Z0-9,;=.-\s]*$/.test(acceptLanguage)) {
//     return defaultLocale;
//   }

//   try {
//     // Parse Accept-Language header value
//     const languages = acceptLanguage
//       .split(",")
//       .map(lang => {
//         const [language, weight = "1.0"] = lang.trim().split(";q=");
//         // Extract primary language code and validate format
//         const primaryLang = language.split("-")[0].toLowerCase();
//         if (!/^[a-z]{2,3}$/.test(primaryLang)) {
//           return ["", 0] as const;
//         }
//         const qValue = parseFloat(weight);
//         // Validate q-value is between 0 and 1
//         if (isNaN(qValue) || qValue < 0 || qValue > 1) {
//           return ["", 0] as const;
//         }
//         return [primaryLang, qValue] as const;
//       })
//       .filter(([lang, weight]) => lang && weight > 0)
//       .sort((a, b) => b[1] - a[1]);

//     // Find the first matching locale
//     const matchedLocale = languages.find(([lang]) => isValidLocale(lang))?.[0];
//     return matchedLocale as ValidLocale || defaultLocale;
//   } catch {
//     return defaultLocale;
//   }
// }

// function getLocale(request: NextRequest): ValidLocale {
//   // Check cookie first
//   if (request.cookies.has(cookieName)) {
//     const cookieValue = request.cookies.get(cookieName)!.value;
//     // Validate cookie value
//     return isValidLocale(cookieValue) ? cookieValue : defaultLocale;
//   }
  
//   // Fall back to Accept-Language header
//   return parseAcceptLanguage(request.headers.get("Accept-Language"));
// }

// export function middleware(request: NextRequest) {
//   // Skip Next.js internal routes
//   if (request.nextUrl.pathname.startsWith("/_next")) {
//     return NextResponse.next();
//   }

//   const { pathname } = request.nextUrl;
  
//   // Check if pathname already has a locale
//   const pathnameHasLocale = locales.some(
//     locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
//   );

//   if (pathnameHasLocale) return;

//   // For paths without a locale, we need to add the default locale
//   const locale = pathname === "/" ? defaultLocale : getLocale(request);
//   request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  
//   const response = NextResponse.redirect(request.nextUrl);
//   response.cookies.set(cookieName, locale);
//   return response;
// }

// export const config = {
//   matcher: ["/((?!_next).*)"],
// };



// // src/middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// const locales = ["en", "af"] as const;
// type ValidLocale = typeof locales[number];
// const defaultLocale = "en";
// const cookieName = "i18nlang";

// // Validate if a string is a supported locale
// function isValidLocale(locale: string): locale is ValidLocale {
//   return locales.includes(locale as ValidLocale);
// }

// function parseAcceptLanguage(acceptLanguage: string | null): ValidLocale {
//   if (!acceptLanguage) return defaultLocale;

//   // Sanitize input - only allow standard Accept-Language characters
//   if (!/^[a-zA-Z0-9,;=.-\s]*$/.test(acceptLanguage)) {
//     return defaultLocale;
//   }

//   try {
//     // Parse Accept-Language header value
//     const languages = acceptLanguage
//       .split(",")
//       .map(lang => {
//         const [language, weight = "1.0"] = lang.trim().split(";q=");
//         // Extract primary language code and validate format
//         const primaryLang = language.split("-")[0].toLowerCase();
//         if (!/^[a-z]{2,3}$/.test(primaryLang)) {
//           return ["", 0] as const;
//         }
//         const qValue = parseFloat(weight);
//         // Validate q-value is between 0 and 1
//         if (isNaN(qValue) || qValue < 0 || qValue > 1) {
//           return ["", 0] as const;
//         }
//         return [primaryLang, qValue] as const;
//       })
//       .filter(([lang, weight]) => lang && weight > 0)
//       .sort((a, b) => b[1] - a[1]);

//     // Find the first matching locale
//     const matchedLocale = languages.find(([lang]) => isValidLocale(lang))?.[0];
//     return matchedLocale as ValidLocale || defaultLocale;
//   } catch {
//     return defaultLocale;
//   }
// }

// function getLocale(request: NextRequest): ValidLocale {
//   // Check cookie first
//   if (request.cookies.has(cookieName)) {
//     const cookieValue = request.cookies.get(cookieName)!.value;
//     // Validate cookie value
//     return isValidLocale(cookieValue) ? cookieValue : defaultLocale;
//   }
  
//   // Fall back to Accept-Language header
//   return parseAcceptLanguage(request.headers.get("Accept-Language"));
// }

// export function middleware(request: NextRequest) {
//   // Skip Next.js internal routes
//   if (request.nextUrl.pathname.startsWith("/_next")) {
//     return NextResponse.next();
//   }

//   const { pathname } = request.nextUrl;
  
//   // If the path starts with the default locale, strip it and redirect
//   if (pathname.startsWith(`/${defaultLocale}/`)) {
//     const newPathname = pathname.replace(`/${defaultLocale}`, '') || '/';
//     const response = NextResponse.redirect(new URL(newPathname, request.url));
//     response.cookies.set(cookieName, defaultLocale);
//     return response;
//   }

//   // Check if pathname has a non-default locale
//   const hasNonDefaultLocale = locales
//     .filter(locale => locale !== defaultLocale)
//     .some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

//   if (hasNonDefaultLocale) {
//     // Let non-default locale paths pass through
//     return NextResponse.next();
//   }

//   // For all other paths, determine locale
//   const locale = getLocale(request);
  
//   if (locale !== defaultLocale) {
//     // Non-default locale needs explicit prefix in URL
//     request.nextUrl.pathname = `/${locale}${pathname}`;
//     const response = NextResponse.redirect(request.nextUrl);
//     response.cookies.set(cookieName, locale);
//     return response;
//   }

//   // For default locale, rewrite internally but keep URL unchanged
//   const response = NextResponse.rewrite(new URL(`/${defaultLocale}${pathname}`, request.url));
//   response.cookies.set(cookieName, defaultLocale);
//   return response;
// }

// export const config = {
//   matcher: ["/((?!_next).*)"],
// };



// // src/middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// const locales = ["en", "af"] as const;
// type ValidLocale = typeof locales[number];
// const defaultLocale = "en";
// const cookieName = "i18nlang";

// function isValidLocale(locale: string): locale is ValidLocale {
//   return locales.includes(locale as ValidLocale);
// }

// function parseAcceptLanguage(acceptLanguage: string | null): ValidLocale {
//   if (!acceptLanguage) return defaultLocale;
//   try {
//     const preferredLocale = acceptLanguage
//       .split(",")[0]
//       .split("-")[0]
//       .toLowerCase();
//     return isValidLocale(preferredLocale) ? preferredLocale : defaultLocale;
//   } catch {
//     return defaultLocale;
//   }
// }

// function getStoredLocale(request: NextRequest): ValidLocale {
//   // Check cookie first
//   if (request.cookies.has(cookieName)) {
//     const cookieValue = request.cookies.get(cookieName)!.value;
//     if (isValidLocale(cookieValue)) return cookieValue;
//   }
//   return parseAcceptLanguage(request.headers.get("Accept-Language"));
// }

// export function middleware(request: NextRequest) {
//   // Skip Next.js internal routes and public files
//   if (request.nextUrl.pathname.match(/(^\/(_next|api)|\.(ico|png|jpg|jpeg|svg)$)/)) {
//     return NextResponse.next();
//   }

//   const { pathname } = request.nextUrl;
  
//   // Handle language switch requests - update cookie and redirect to same path
//   if (pathname.startsWith('/lang/')) {
//     const newLocale = pathname.split('/')[2];
//     if (isValidLocale(newLocale)) {
//       // Remove /lang/[locale] and get the rest of the path
//       const targetPath = pathname.replace(/^\/lang\/[^/]+/, '') || '/';
//       const response = NextResponse.redirect(new URL(
//         newLocale === defaultLocale ? targetPath : `/${newLocale}${targetPath}`,
//         request.url
//       ));
//       response.cookies.set(cookieName, newLocale);
//       return response;
//     }
//   }

//   // Get current locale from cookie/header
//   const currentLocale = getStoredLocale(request);
  
//   // If URL has a locale prefix
//   const urlLocaleMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
//   if (urlLocaleMatch) {
//     const urlLocale = urlLocaleMatch[1];
//     if (isValidLocale(urlLocale)) {
//       // Set cookie to match URL locale
//       const response = NextResponse.next();
//       response.cookies.set(cookieName, urlLocale);
//       return response;
//     }
//   }

//   // No locale in URL - handle based on stored locale
//   if (currentLocale === defaultLocale) {
//     // Default locale - rewrite internally but keep URL clean
//     const response = NextResponse.rewrite(
//       new URL(`/${defaultLocale}${pathname}`, request.url)
//     );
//     response.cookies.set(cookieName, defaultLocale);
//     return response;
//   } else {
//     // Non-default locale - redirect to add prefix
//     const response = NextResponse.redirect(
//       new URL(`/${currentLocale}${pathname}`, request.url)
//     );
//     response.cookies.set(cookieName, currentLocale);
//     return response;
//   }
// }

// export const config = {
//   matcher: ['/((?!_next|api|.*\\..*).*)'],
// };


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