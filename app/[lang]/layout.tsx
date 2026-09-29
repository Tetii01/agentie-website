import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { getContent, getLocale, locales } from "@/content";
import { rootMetadata } from "@/lib/seo";
import "../globals.css";

// latin-ext conține ș, ț, ă, î, â.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

// Title, description, Open Graph, Twitter card: lib/seo.ts. Imaginea OG: app/opengraph-image.tsx.
export async function generateMetadata(): Promise<Metadata> {
  return rootMetadata(await getLocale());
}

// Paginile se generează static pentru fiecare limbă: /ro (servită la „/") și /en. Alte valori → 404.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: "#0d0d0d", // = --color-background (bara browserului pe mobil)
  colorScheme: "dark",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const { ui } = await getContent();

  return (
    <html lang={locale} className={geistSans.variable}>
      <body className="bg-background font-sans text-foreground">
        {/* Fără JavaScript, elementele cu fade-in rămân vizibile. */}
        <noscript>
          <style>{".fade-in-section{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <a
          href="#continut"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-pill focus:bg-accent focus:px-5 focus:py-3 focus:text-accent-foreground"
        >
          {ui.skipToContent}
        </a>
        <SmoothScroll>
          <Header />
          <main id="continut">{children}</main>
          <Footer />
        </SmoothScroll>
        {/* Vercel Web Analytics (fără cookie-uri). Doar pe Vercel: local, scriptul nu există și ar da eroare în consolă. */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}
