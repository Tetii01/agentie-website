import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { problems } from "@/content/site";
import { stagger } from "@/lib/stagger";

/**
 * Probleme, ca grid de carduri: în stânga un card înalt cu titlul și concluzia,
 * în dreapta cele 4 probleme (2×2). Pe mobil, toate unul sub altul.
 */
export function Problems() {
  return (
    <Section id={problems.id} aria-labelledby="probleme-titlu" label={problems.label}>
      <div className="grid gap-grid-mobile md:gap-grid lg:grid-cols-3">
        <FadeIn className="lg:row-span-2">
          <Card className="flex h-full flex-col justify-between gap-10 lg:p-10">
            <h2 id="probleme-titlu" className="text-h2-mobile font-bold text-balance md:text-h2">
              {problems.title}
            </h2>
            <p className="text-h3-mobile font-semibold text-balance text-muted md:text-h3">{problems.closing}</p>
          </Card>
        </FadeIn>

        <ul className="grid gap-grid-mobile sm:grid-cols-2 md:gap-grid lg:col-span-2 lg:row-span-2">
          {problems.items.map(({ icon: Icon, title, text }, index) => (
            <FadeIn as="li" key={title} delay={stagger(index, 2)}>
              <Card padding="md" className="flex h-full flex-col gap-6">
                <span className="grid size-11 place-items-center rounded-full border border-border bg-surface-2 text-accent">
                  <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-balance">{title}</h3>
                  <p className="mt-2 text-base text-pretty text-muted">{text}</p>
                </div>
              </Card>
            </FadeIn>
          ))}
        </ul>
      </div>
    </Section>
  );
}
