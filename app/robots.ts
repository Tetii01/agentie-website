import type { MetadataRoute } from "next";
import { allowIndexing, siteUrl } from "@/lib/seo";

/** Până la lansare (NEXT_PUBLIC_ALLOW_INDEXING diferit de „true"): blochează tot. */
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
