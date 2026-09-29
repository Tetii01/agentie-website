import { en } from "./en";
import { ro, type SiteContent } from "./site";

/**
 * Limbile site-ului. Româna e la „/", engleza la „/en" (vezi rewrites în next.config.ts).
 * Fișierul ăsta nu depinde de pagina curentă, deci merge și în route handlers (ex. app/api/lead).
 * În componente se folosește getContent() din content/index.ts.
 */
export const locales = ["ro", "en"] as const;
export type Locale = (typeof locales)[number];

const content: Record<Locale, SiteContent> = { ro, en };

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Conținutul pentru o limbă dată; orice altă valoare → română. */
export function contentFor(locale: string): SiteContent {
  return content[isLocale(locale) ? locale : "ro"];
}
