import { lang } from "next/root-params";
import type { SiteContent } from "./site";
import { contentFor, isLocale, type Locale } from "./locales";

export { locales, type Locale } from "./locales";

/**
 * Limba paginii curente, din segmentul [lang] (toate paginile stau în app/[lang]).
 * Doar în componentele de server; în route handlers se folosește contentFor() din content/locales.ts.
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  return value && isLocale(value) ? value : "ro";
}

/** Tot conținutul, în limba paginii curente. */
export async function getContent(): Promise<SiteContent> {
  return contentFor(await getLocale());
}
