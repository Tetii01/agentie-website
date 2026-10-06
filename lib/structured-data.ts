import type { Locale } from "@/content/locales";
import type { SiteContent } from "@/content/site";
import { siteUrl } from "@/lib/seo";

const inLanguage: Record<Locale, string> = { ro: "ro-RO", en: "en" };

/** „TETI" → „Teti" (în carduri, numele sunt scrise cu majuscule). */
const properCase = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

/**
 * Datele structurate (JSON-LD) ale primei pagini: firma (ProfessionalService) și site-ul (WebSite).
 * Google le folosește pentru numele site-ului din rezultate, panoul firmei și căutările locale („agenție AI Sibiu").
 * Totul vine din content, deci urmează orice schimbare de text, telefon, servicii sau fondatori.
 * Se verifică cu Rich Results Test: https://search.google.com/test/rich-results
 */
export function structuredData(locale: Locale, content: SiteContent) {
  const { brand, seo, company, contact, services, about, footer } = content;
  const organizationId = `${siteUrl}/#organization`;
  const social = footer.social.filter((item) => !item.placeholder).map((item) => item.href);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": organizationId,
        name: brand.name,
        url: `${siteUrl}/`,
        logo: `${siteUrl}/apple-icon`,
        image: `${siteUrl}/opengraph-image`,
        description: seo.description,
        telephone: contact.phone.href.replace(/^tel:/, ""),
        email: contact.email.href.replace(/^mailto:/, ""),
        address: { "@type": "PostalAddress", addressLocality: company.locality, addressCountry: company.countryCode },
        areaServed: { "@type": "Country", name: company.areaServed },
        founder: about.founders
          .filter((founder) => !founder.placeholder)
          .map((founder) => ({
            "@type": "Person",
            name: properCase(founder.name),
            jobTitle: founder.role,
            sameAs: founder.instagram.url,
          })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: services.title,
          itemListElement: services.items.map((service) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: service.title, description: service.description },
          })),
        },
        ...(social.length > 0 && { sameAs: social }),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: brand.name,
        alternateName: new URL(siteUrl).hostname.replace(/^www\./, ""),
        inLanguage: inLanguage[locale],
        publisher: { "@id": organizationId },
      },
    ],
  };
}

/** Textul pentru <script type="application/ld+json">: `<` devine <, ca un text să nu poată închide tag-ul (ghidul JSON-LD din Next). */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
