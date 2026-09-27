import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${siteUrl}${routes.home}`, lastModified, changeFrequency: "monthly", priority: 1 },
    ...[routes.privacy, routes.cookies, routes.terms].map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
