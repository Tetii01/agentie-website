import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { RotatingText, RotationProvider } from "@/components/ui/RotatingText";
import { hero } from "@/content/site";

/**
 * Hero: un card mare (mai scurt decât ecranul, ca să se vadă că pagina continuă). Sus, un „cer"
 * întunecat cu o rețea fină de puncte; jos, un orizont care se aprinde în accent.
 * Deasupra orizontului, în stânga: titlul pe două rânduri (acțiunea AI-ului se schimbă singură) și butonul.
 * Stilurile: hero-frame, hero-dots, hero-horizon în app/globals.css.
 */
export function Hero() {
  const { primaryCta } = hero;

  return (
    <section className="pt-[calc(var(--spacing-header-mobile)+0.5rem)] md:pt-[calc(var(--spacing-header)+0.75rem)]">
      <Container>
        <div className="hero-frame relative isolate flex min-h-[32rem] flex-col justify-end overflow-hidden rounded-card md:min-h-[clamp(36rem,calc(100svh-var(--spacing-header)-6rem),44rem)]">
          <div aria-hidden className="hero-dots absolute inset-0 -z-10" />
          {/* Orizontul: marginea de sus a cercului stă la 7rem (mobil) / 10rem (desktop) de jos. */}
          <div
            aria-hidden
            className="hero-horizon absolute top-[calc(100%-7rem)] left-1/2 -z-10 aspect-square w-[300%] -translate-x-1/2 md:top-[calc(100%-10rem)] md:w-[160%]"
          />
          {/* „Soarele": un glow moale pe mijlocul orizontului. */}
          <div
            aria-hidden
            className="absolute top-[calc(100%-7rem)] left-1/2 -z-10 h-28 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-3xl md:top-[calc(100%-10rem)] md:h-36 md:w-[50%]"
          />

          <RotationProvider items={hero.actions}>
            <div className="px-5 pt-12 pb-[calc(7rem+2rem)] md:px-14 md:pb-[calc(10rem+2.5rem)]">
              <div className="flex flex-col items-start">
                <FadeIn eager>
                  <h1 className="text-h1 font-bold md:text-h1-lg">
                    <span className="sr-only">
                      {hero.title} {hero.highlight}
                    </span>
                    <span aria-hidden className="block">
                      {hero.title}
                    </span>
                    <span aria-hidden className="block whitespace-nowrap md:inline">
                      {hero.subject}{" "}
                    </span>
                    <RotatingText className="text-accent" />
                  </h1>
                </FadeIn>

                <FadeIn eager delay={120} className="mt-8 md:mt-10">
                  <Button href={primaryCta.href} variant="light" size="cta">
                    {primaryCta.label}
                    <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-foreground md:size-12">
                      <ArrowRight aria-hidden className="size-5" />
                    </span>
                  </Button>
                </FadeIn>
                {/* Marcaj pentru CTA-ul plutitor: apare după ce linia de sub buton trece de header.
                    Stă în afara FadeIn, ca animația (care coboară butonul 20px) să nu-l miște. */}
                <div data-floating-cta-trigger aria-hidden className="h-px w-full" />
              </div>
            </div>
          </RotationProvider>
        </div>
      </Container>
    </section>
  );
}
