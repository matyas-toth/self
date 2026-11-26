import type { Metadata } from "next";
import { href, type Locale } from "./i18n";

export const siteUrl = new URL("https://maty.as");

export function localizedAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const en = href("en", path);
  const hu = href("hu", path);

  return {
    canonical: locale === "en" ? en : hu,
    languages: { en, hu, "x-default": en },
  };
}
