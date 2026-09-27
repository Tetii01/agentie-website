import type { Metadata } from "next";
import { brand, seo } from "@/content/site";

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

const openGraphBase = {
  type: "website",
  locale: "ro_RO",
  siteName: brand.name,
} as const;

/** Metadata pentru prima pagină (folosită în app/layout.tsx). */
export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: seo.title, template: `%s · ${brand.name}` },
  description: seo.description,
  applicationName: brand.name,
  alternates: { canonical: "/" },
  openGraph: { ...openGraphBase, url: "/", title: seo.title, description: seo.description },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  // Moștenit de toate paginile.
  robots: { index: allowIndexing, follow: allowIndexing },
};

/**
 * Metadata pentru o pagină separată (ex. paginile legale).
 * Imaginea de share se dă explicit: un `openGraph` propriu înlocuiește tot obiectul moștenit,
 * inclusiv imaginea generată de app/opengraph-image.tsx.
 */
export function pageMetadata({ title, description, route }: { title: string; description: string; route: string }): Metadata {
  const fullTitle = `${title} · ${brand.name}`;
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: seo.title };
  return {
    title,
    description,
    alternates: { canonical: route },
    openGraph: { ...openGraphBase, url: route, title: fullTitle, description, images: [image] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}
