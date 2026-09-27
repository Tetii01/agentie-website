import { FloatingCta } from "@/components/sections/FloatingCta";
import { Hero } from "@/components/sections/Hero";
import { SectionStub } from "@/components/sections/SectionStub";
import { ToolsLoop } from "@/components/sections/ToolsLoop";
import { anchors, floatingCta } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero />
      <ToolsLoop />

      {/* TEMPORAR: secțiuni goale, înlocuite în fazele 2 și 3. */}
      <SectionStub id={anchors.problems} label="[SECȚIUNE – Faza 2: Probleme]" />
      <SectionStub id={anchors.services} label="[SECȚIUNE – Faza 2: Servicii]" />
      <SectionStub id={anchors.projects} label="[SECȚIUNE – Faza 2: Proiecte]" />
      <SectionStub label="[SECȚIUNE – Faza 2: Testimoniale]" />
      <SectionStub label="[SECȚIUNE – Faza 2: Cifre]" />
      <SectionStub id={anchors.offer} label="[SECȚIUNE – Faza 3: Analiză gratuită + formular]" tall />
      <SectionStub label="[SECȚIUNE – Faza 3: CTA final]" />
      <SectionStub id={anchors.about} label="[SECȚIUNE – Faza 3: Despre]" />
      <SectionStub label="[SECȚIUNE – Faza 3: Footer]" />

      <FloatingCta {...floatingCta} />
    </>
  );
}
