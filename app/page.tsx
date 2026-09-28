import { About } from "@/components/sections/About";
import { FloatingCta } from "@/components/sections/FloatingCta";
import { Hero } from "@/components/sections/Hero";
import { Offer } from "@/components/sections/Offer";
import { Problems } from "@/components/sections/Problems";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { SolutionsBand } from "@/components/sections/SolutionsBand";
import { Testimonials } from "@/components/sections/Testimonials";
import { floatingCta } from "@/content/site";

/**
 * Ordinea paginii: hero → proiecte (carusel) → testimoniale (cu tool-urile integrate) →
 * grid-uri de carduri: probleme, banda cu ce construim, servicii, analiza gratuită (cu cifrele), despre (cu CTA-ul final).
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Testimonials />
      <Problems />
      <SolutionsBand />
      <Services />
      <Offer />
      <About />
      <FloatingCta {...floatingCta} />
    </>
  );
}
