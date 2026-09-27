import { About } from "@/components/sections/About";
import { FinalCta } from "@/components/sections/FinalCta";
import { FloatingCta } from "@/components/sections/FloatingCta";
import { Hero } from "@/components/sections/Hero";
import { Offer } from "@/components/sections/Offer";
import { Problems } from "@/components/sections/Problems";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { ToolsLoop } from "@/components/sections/ToolsLoop";
import { floatingCta } from "@/content/site";

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
      <Offer />
      <FinalCta />
      <About />
      <FloatingCta {...floatingCta} />
    </>
  );
}
