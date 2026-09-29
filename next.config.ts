import type { NextConfig } from "next";

/** Rutele în română, servite fără prefix de limbă (paginile stau în app/[lang], cu lang = "ro"). */
const romanianRoutes = ["/", "/politica-de-confidentialitate", "/politica-de-cookies", "/termeni-si-conditii"];

const nextConfig: NextConfig = {
  // Româna e la „/" (și „/politica-…"), engleza la „/en". Intern, româna e generată la /ro.
  async rewrites() {
    return {
      beforeFiles: romanianRoutes.map((route) => ({ source: route, destination: `/ro${route === "/" ? "" : route}` })),
      afterFiles: [],
      fallback: [],
    };
  },
  // Adresele cu /ro nu se folosesc: duc la varianta fără prefix.
  async redirects() {
    return [
      { source: "/ro", destination: "/", permanent: true },
      { source: "/ro/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
