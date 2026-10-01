import { ArrowRight } from "lucide-react";
import { logoShapes, lettersViewBox } from "@/components/brand/logo-shapes";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { RotatingText, RotationProvider } from "@/components/ui/RotatingText";
import { getContent } from "@/content";

/**
 * Hero: un card mare (mai scurt decât ecranul, ca să se vadă că pagina continuă). Sus, un „cer"
 * întunecat cu o rețea fină de puncte; jos, un orizont care se aprinde în accent, cu o lumină care „respiră".
 * Sub linia orizontului, „creos" în litere uriașe, care urcă la încărcare.
 * Deasupra orizontului, în stânga: titlul pe două rânduri (acțiunea AI-ului se schimbă singură), butonul
 * principal și, lângă el, butonul discret de schimbare a limbii (RO / EN).
 *
 * Mișcarea (preluată din „motion footer"): titlul și butoanele urcă unul după altul la încărcare; la scroll,
 * restul paginii urcă peste hero ca o cortină (app/[lang]/page.tsx), iar hero-ul se retrage și literele
 * coboară și dispar (hero-recede, hero-letters-sink). Stilurile: app/globals.css.
 */
export async function Hero() {
  const { hero, ui } = await getContent();
  const { primaryCta } = hero;

  return (
    <section className="pt-[calc(var(--spacing-header-mobile)+0.5rem)] md:pt-[calc(var(--spacing-header)+0.75rem)]">
      <Container>
        <div className="hero-frame hero-recede relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-card md:min-h-[clamp(36rem,calc(100svh-var(--spacing-header)-6rem),44rem)]">
          <div aria-hidden className="hero-dots absolute inset-0 -z-10" />
          {/* Orizontul: marginea de sus a cercului stă la 6rem (mobil) / 10rem (desktop) de jos. */}
          <div
            aria-hidden
            className="hero-horizon absolute top-[calc(100%-6rem)] left-1/2 -z-10 aspect-square w-[300%] -translate-x-1/2 md:top-[calc(100%-10rem)] md:w-[160%]"
          />
          {/* „Soarele": un glow moale pe mijlocul orizontului, care respiră încet. */}
          <div
            aria-hidden
            className="absolute top-[calc(100%-6rem)] left-1/2 -z-10 h-28 w-[80%] -translate-x-1/2 -translate-y-1/2 animate-breathe rounded-full bg-accent/25 blur-3xl md:top-[calc(100%-10rem)] md:h-36 md:w-[50%]"
          />

          {/* „creos" uriaș, pe „suprafața planetei": începe puțin sub linia orizontului și e tăiat de marginea
              de jos a cardului, deci nu trece niciodată pe sub titlu. Vine după orizont în DOM, ca să stea peste el. */}
          <div
            aria-hidden
            className="hero-letters-sink pointer-events-none absolute inset-x-0 top-[calc(100%-6rem+0.75rem)] -z-10 flex justify-center md:top-[calc(100%-10rem+1.5rem)]"
          >
            <div className="w-[94%] animate-letters-rise">
              <svg
                viewBox={`${lettersViewBox.x} ${lettersViewBox.y} ${lettersViewBox.width} ${lettersViewBox.height}`}
                className="hero-letters block h-auto w-full"
              >
                <defs>
                  <linearGradient id="hero-letters-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="currentColor" stopOpacity="0.14" />
                    <stop offset="0.7" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {logoShapes.slice(1).map((d) => (
                  <path key={d} d={d} fill="url(#hero-letters-fill)" vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
            </div>
          </div>
          <RotationProvider items={hero.actions}>
            <div className="px-5 pt-12 pb-[calc(6rem+1.75rem)] md:px-14 md:pb-[calc(10rem+2.5rem)]">
              <div className="flex flex-col items-start">
                <FadeIn eager>
                  <h1 className="text-h1 font-bold md:text-h1-lg">
                    <span className="sr-only">
                      {hero.title} {hero.highlight}
                    </span>
                    <span aria-hidden className="block text-metal">
                      {hero.title}
                    </span>
                    <span aria-hidden className="whitespace-nowrap text-metal">
                      {hero.subject}{" "}
                    </span>
                    <RotatingText className="text-accent" />
                  </h1>
                </FadeIn>

                <FadeIn eager delay={150} className="mt-6 flex flex-wrap items-center gap-2.5 md:mt-10 md:gap-3">
                  <Button href={primaryCta.href} variant="light" size="cta">
                    {primaryCta.label}
                    <span className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground md:size-12">
                      <ArrowRight aria-hidden className="size-4 md:size-5" />
                    </span>
                  </Button>
                  <LanguageSwitch {...ui.languageSwitch} />
                </FadeIn>
              </div>
            </div>
          </RotationProvider>
        </div>
      </Container>
    </section>
  );
}
