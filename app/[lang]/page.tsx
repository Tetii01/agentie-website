import { About } from "@/components/sections/About";
import { FloatingCta } from "@/components/sections/FloatingCta";
import { Hero } from "@/components/sections/Hero";
import { Offer } from "@/components/sections/Offer";
import { Problems } from "@/components/sections/Problems";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { getContent } from "@/content";

/**
 * Ordinea paginii: hero → proiecte (carusel) → testimoniale (cu tool-urile integrate) →
 * grid-uri de carduri: probleme, servicii, analiza gratuită (cu cifrele), despre (cu CTA-ul final).
 */
export default async function Home() {
  const { floatingCta } = await getContent();

  return (
    <>
      <Hero />
      <Projects />
      <Testimonials />
      <Problems />
      <Services />
      <Offer />
      <About />
      <FloatingCta {...floatingCta} />
    </>
  );
}
