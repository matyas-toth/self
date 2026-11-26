export type Locale = "en" | "hu";

export const dict = {
  en: {
    other: "hu",
    role: "Automation Specialist",
    collections: "Collections",
    blog: "Blog",
    blogTitle: "Random Thoughts",
    theme: { system: "system", light: "light", dark: "dark" },
  },
  hu: {
    other: "en",
    role: "Automation Specialist",
    collections: "Gyűjtemények",
    blog: "Blog",
    blogTitle: "Kósza gondolatok",
    theme: { system: "rendszer", light: "világos", dark: "sötét" },
  },
} as const;

/** Prefix a path for the given locale. */
export function href(locale: Locale, path: string) {
  if (locale === "en") return path;
  return path === "/" ? "/hu" : `/hu${path}`;
}

export function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "hu" ? "hu-HU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
