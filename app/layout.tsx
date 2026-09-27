import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/sections/Header";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { seo, ui } from "@/content/site";
import "./globals.css";

// latin-ext conține ș, ț, ă, î, â.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

// Metadata de bază; OG, Twitter card și restul se completează în Faza 4.
export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ro" className={geistSans.variable}>
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
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
