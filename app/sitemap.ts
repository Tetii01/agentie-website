import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { homePath, indexLegalPages, siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // Prima pagină în română și în engleză: Google află că sunt aceeași pagină, în limbi diferite.
  const languages = { ro: `${siteUrl}${homePath.ro}`, en: `${siteUrl}${homePath.en}` };

  return [
    { url: languages.ro, lastModified, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: languages.en, lastModified, changeFrequency: "monthly", priority: 0.8, alternates: { languages } },
    // Paginile legale apar doar când au datele reale ale firmei (până atunci au noindex: lib/seo.ts).
    ...(indexLegalPages ? [routes.privacy, routes.cookies, routes.terms] : []).map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
