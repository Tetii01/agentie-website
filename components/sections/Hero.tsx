import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { RotatingText } from "@/components/ui/RotatingText";
import { hero } from "@/content/site";

/**
 * Hero: un card mare, cât ecranul (sub header). Sus, un „cer" întunecat cu o rețea fină de puncte;
 * jos, un orizont care se aprinde în accent. Textul, aliniat la stânga, stă deasupra orizontului:
 * eticheta, titlul pe două rânduri (în al doilea, acțiunea AI-ului se schimbă singură) și butonul.
 * Stilurile: hero-frame, hero-dots, hero-horizon, pulse-dot în app/globals.css.
 */
export function Hero() {
  const { primaryCta } = hero;

  return (
    <section className="pt-[calc(var(--spacing-header-mobile)+0.5rem)] md:pt-[calc(var(--spacing-header)+0.75rem)]">
      <Container>
        <div className="hero-frame relative isolate flex min-h-[max(34rem,calc(100svh-var(--spacing-header-mobile)-1.25rem))] flex-col justify-between overflow-hidden rounded-card md:min-h-[max(40rem,calc(100svh-var(--spacing-header)-2rem))]">
          <div aria-hidden className="hero-dots absolute inset-0 -z-10" />
          {/* Orizontul: marginea de sus a cercului stă la 8rem (mobil) / 11rem (desktop) de jos. */}
          <div
            aria-hidden
            className="hero-horizon absolute top-[calc(100%-8rem)] left-1/2 -z-10 aspect-square w-[300%] -translate-x-1/2 md:top-[calc(100%-11rem)] md:w-[160%]"
          />
          {/* „Soarele": un glow moale pe mijlocul orizontului. */}
          <div
            aria-hidden
            className="absolute top-[calc(100%-8rem)] left-1/2 -z-10 h-28 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-3xl md:top-[calc(100%-11rem)] md:h-36 md:w-[50%]"
          />

          <FadeIn eager className="px-5 pt-5 md:px-14 md:pt-12">
            <p className="inline-flex items-center gap-2.5 rounded-pill border border-border bg-background/60 px-4 py-2 text-sm backdrop-blur-md">
              <span aria-hidden className="pulse-dot size-2 rounded-full bg-accent motion-reduce:animate-none" />
              {hero.eyebrow}
            </p>
          </FadeIn>

          <div className="flex flex-col items-start px-5 pt-16 pb-[calc(8rem+2rem)] md:px-14 md:pb-[calc(11rem+3rem)]">
            <FadeIn eager delay={80}>
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
                <RotatingText items={hero.actions} className="text-accent" />
              </h1>
            </FadeIn>

            <FadeIn eager delay={160} className="mt-8 md:mt-10">
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
      </Container>
    </section>
  );
}
