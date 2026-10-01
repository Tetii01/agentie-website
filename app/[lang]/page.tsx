import { About } from "@/components/sections/About";
import { FloatingCta } from "@/components/sections/FloatingCta";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Offer } from "@/components/sections/Offer";
import { Problems } from "@/components/sections/Problems";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { getContent } from "@/content";

/**
 * Ordinea paginii: hero → proiecte (carusel) → testimoniale (cu tool-urile integrate) →
 * grid-uri de carduri: probleme, servicii, analiza gratuită (cu cifrele), despre (cu CTA-ul final).
 *
 * Intro (Intro.tsx): loader-ul de la prima intrare, după lircle.co.
 * Cortina (efectul din „motion footer", întors pentru partea de sus a paginii): hero-ul stă fixat
 * (`sticky`), iar restul paginii urcă peste el, cu marginea de sus rotunjită (hero-curtain).
 */
export default async function Home() {
  const { floatingCta } = await getContent();

  return (
    <div className="relative">
      <Intro />
      <div className="sticky top-0">
        <Hero />
      </div>

      <div className="hero-curtain relative z-10 mt-6 pt-2 md:mt-10 md:pt-4">
        {/* Marcaj pentru CTA-ul plutitor: apare după ce cortina a acoperit hero-ul (marcajul trece de header). */}
        <div data-floating-cta-trigger aria-hidden className="absolute inset-x-0 top-0 h-px" />
        <Projects />
        <Testimonials />
        <Problems />
        <Services />
        <Offer />
        <About />
      </div>

      <FloatingCta {...floatingCta} />
    </div>
  );
}
