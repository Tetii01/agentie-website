import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { KeepHyphenated } from "@/components/ui/KeepHyphenated";
import { hero } from "@/content/site";

/**
 * Hero: un card mare cu contur luminos în accent, cât ecranul (sub header).
 * În card: un cerc (vizualul de brand) pe jumătate ascuns sub un panou de sticlă cu dungi,
 * iar pe sticlă titlul pe două rânduri (al doilea în accent) și butonul spre analiză.
 * Stilurile: hero-frame, hero-orb, hero-glass în app/globals.css.
 */
export function Hero() {
  const { visual, primaryCta } = hero;

  return (
    <section className="pt-[calc(var(--spacing-header-mobile)+0.5rem)] md:pt-[calc(var(--spacing-header)+0.75rem)]">
      <Container>
        <div className="hero-frame relative isolate flex min-h-[max(34rem,calc(100svh-var(--spacing-header-mobile)-1.25rem))] flex-col items-center justify-end overflow-hidden rounded-card px-5 pb-10 text-center md:min-h-[max(40rem,calc(100svh-var(--spacing-header)-2rem))] md:pb-16">
          <div
            aria-hidden
            className="hero-orb absolute top-[11%] left-1/2 -z-10 aspect-square w-[min(34rem,80vw)] -translate-x-1/2 overflow-hidden"
          >
            {visual.image && (
              <Image src={visual.image.src} alt="" fill priority sizes="544px" className="object-cover" />
            )}
          </div>
          <div aria-hidden className="hero-glass absolute inset-x-0 bottom-0 -z-10 h-[56%] md:h-[52%]" />

          <FadeIn eager>
            <h1 className="text-h1 font-bold text-balance">
              <KeepHyphenated text={hero.title} />
              <br />
              <span className="text-accent">
                <KeepHyphenated text={hero.highlight} />
              </span>
            </h1>
          </FadeIn>

          <FadeIn eager delay={120} className="mt-8 md:mt-10">
            <Button href={primaryCta.href} size="cta">
              {primaryCta.label}
              <span className="grid size-10 place-items-center rounded-full bg-accent-foreground text-accent md:size-12">
                <ArrowRight aria-hidden className="size-5" />
              </span>
            </Button>
          </FadeIn>
          {/* Marcaj pentru CTA-ul plutitor: apare după ce linia de sub buton trece de header.
              Stă în afara FadeIn, ca animația (care coboară butonul 20px) să nu-l miște. */}
          <div data-floating-cta-trigger aria-hidden className="h-px w-full" />
        </div>
      </Container>
    </section>
  );
}
