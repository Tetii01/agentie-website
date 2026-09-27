import { FloatingCta } from "@/components/sections/FloatingCta";
import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { Projects } from "@/components/sections/Projects";
import { SectionStub } from "@/components/sections/SectionStub";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { ToolsLoop } from "@/components/sections/ToolsLoop";
import { anchors, floatingCta } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero />
      <ToolsLoop />
      <Problems />
      <Services />
      <Projects />
      <Testimonials />
      <Stats />

      {/* TEMPORAR: secțiuni goale, înlocuite în Faza 3. */}
      <SectionStub id={anchors.offer} label="[SECȚIUNE – Faza 3: Analiză gratuită + formular]" tall />
      <SectionStub label="[SECȚIUNE – Faza 3: CTA final]" />
      <SectionStub id={anchors.about} label="[SECȚIUNE – Faza 3: Despre]" />
      <SectionStub label="[SECȚIUNE – Faza 3: Footer]" />

      <FloatingCta {...floatingCta} />
    </>
  );
}
