import type { Metadata } from "next";
import { contentFor, type Locale } from "@/content/locales";
import { ro } from "@/content/site";

/**
 * URL-ul public al site-ului, fără „/" la final. Ordinea:
 * 1. NEXT_PUBLIC_SITE_URL (setat de noi, ex. https://domeniu.ro);
 * 2. domeniul de producție Vercel (VERCEL_PROJECT_PRODUCTION_URL, setat automat de Vercel);
 * 3. http://localhost:3000 (local).
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

/**
 * Indexarea de către motoarele de căutare e permisă doar când NEXT_PUBLIC_ALLOW_INDEXING=true.
 * Altfel (până la lansare): robots.txt blochează tot și fiecare pagină are meta robots noindex, nofollow.
 * Se citește la build: după ce schimbi variabila pe Vercel, refă deploy-ul.
 */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

/** Adresa primei pagini pentru fiecare limbă. */
export const homePath: Record<Locale, string> = { ro: "/", en: "/en" };

const ogLocale: Record<Locale, string> = { ro: "ro_RO", en: "en_US" };

/**
 * Imaginea de share (app/opengraph-image.tsx). Se dă explicit peste tot: layout-ul rădăcină e
 * app/[lang]/layout.tsx, iar imaginea din app/ nu ajunge singură în metadata primei pagini
 * (fără ea, iMessage și WhatsApp aleg o poză oarecare din pagină).
 */
function shareImage(alt: string) {
  return { url: "/opengraph-image", width: 1200, height: 630, alt };
}

/** Metadata pentru prima pagină, în limba dată (folosită în app/[lang]/layout.tsx). */
export function rootMetadata(locale: Locale): Metadata {
  const { brand, seo } = contentFor(locale);
  const url = homePath[locale];
  const image = shareImage(brand.name);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: seo.title, template: `%s · ${brand.name}` },
    description: seo.description,
    applicationName: brand.name,
    // Google află că /  și /en sunt aceeași pagină, în limbi diferite.
    alternates: { canonical: url, languages: { ro: homePath.ro, en: homePath.en, "x-default": homePath.ro } },
    // Previzualizarea linkului folosește titlul cu sloganul (shareTitle), Google pe cel cu cuvintele căutate (title).
    openGraph: { type: "website", locale: ogLocale[locale], siteName: brand.name, url, title: seo.shareTitle, description: seo.description, images: [image] },
    twitter: { card: "summary_large_image", title: seo.shareTitle, description: seo.description, images: [image] },
    // Moștenit de toate paginile.
    robots: { index: allowIndexing, follow: allowIndexing },
  };
}

/**
 * Paginile legale intră în Google (și în sitemap) doar după ce au datele reale ale firmei.
 * Cât timp `company.placeholder` e true în content/site.ts, au noindex: altfel Google ar afișa „[DENUMIRE FIRMĂ]".
 */
export const indexLegalPages = allowIndexing && !ro.company.placeholder;

/**
 * Metadata pentru o pagină separată (ex. paginile legale, care există doar în română).
 * Imaginea de share se dă explicit: un `openGraph` propriu înlocuiește tot obiectul moștenit,
 * inclusiv imaginea generată de app/opengraph-image.tsx.
 */
export function pageMetadata({ title, description, route }: { title: string; description: string; route: string }): Metadata {
  const { brand } = ro;
  const fullTitle = `${title} · ${brand.name}`;
  const image = shareImage(brand.name);
  return {
    title,
    description,
    alternates: { canonical: route },
    openGraph: { type: "website", locale: ogLocale.ro, siteName: brand.name, url: route, title: fullTitle, description, images: [image] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
    robots: { index: indexLegalPages, follow: allowIndexing },
  };
}
