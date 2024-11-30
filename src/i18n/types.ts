// src/i18n/types.ts
export const locales = ["en", "af"] as const;
export type SupportedLanguages = typeof locales[number];
export const defaultLocale = "en";

// Type guard to check if a string is a supported locale
export function isValidLocale(locale: string): locale is SupportedLanguages {
  return locales.includes(locale as SupportedLanguages);
}