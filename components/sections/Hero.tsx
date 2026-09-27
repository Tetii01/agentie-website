import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Placeholder } from "@/components/ui/Placeholder";
import { hero } from "@/content/site";

export function Hero() {
  const { visual } = hero;

  return (
    <section className="overflow-x-clip pt-36 md:pt-48">
      <Container className="flex flex-col items-center text-center">
        <FadeIn eager>
          <h1 className="max-w-5xl text-h1-mobile font-bold text-balance md:text-h1">
            {hero.title} <span className="text-accent">{hero.highlight}</span>
          </h1>
        </FadeIn>

        <FadeIn eager delay={80}>
          <p className="mt-6 max-w-narrow text-lead-mobile font-medium text-pretty text-muted md:mt-8 md:text-lead">
            {hero.subtitle}
          </p>
        </FadeIn>

        <FadeIn eager delay={160} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 md:mt-12">
          <Button href={hero.primaryCta.href} size="lg">
            {hero.primaryCta.label}
          </Button>
          <Button href={hero.secondaryCta.href} variant="ghost" size="lg">
            {hero.secondaryCta.label}
          </Button>
        </FadeIn>

        <FadeIn eager delay={240} className="relative mt-16 w-full max-w-md md:mt-24 md:max-w-xl">
          <div aria-hidden className="bg-glow pointer-events-none absolute -inset-1/3 blur-2xl" />
          {/* TODO conținut real: când avem imaginea, `visual.image` → next/image în locul Placeholder-ului. */}
          <Placeholder
            label={visual.label}
            shape={visual.shape}
            aspect="square"
            className="relative w-full"
          />
        </FadeIn>
      </Container>
    </section>
  );
}
