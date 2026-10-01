import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { getContent } from "@/content";
import { stagger } from "@/lib/stagger";

/**
 * Probleme, ca grid de carduri: în stânga un card înalt cu titlul și concluzia,
 * în dreapta cele 4 probleme (2×2). Pe mobil, toate unul sub altul.
 */
export async function Problems() {
  const { problems } = await getContent();

  return (
    <Section id={problems.id} aria-labelledby="probleme-titlu" spacing="wide">
      <div className="grid gap-grid-mobile md:gap-grid lg:grid-cols-3">
        <FadeIn className="lg:row-span-2">
          <Card className="flex h-full flex-col justify-between gap-6 md:gap-10 lg:p-10">
            <h2 id="probleme-titlu" className="text-h2-mobile font-bold text-balance md:text-h2 text-metal">
              {problems.title}
            </h2>
            <p className="text-h3-mobile font-semibold text-balance text-muted md:text-h3">{problems.closing}</p>
          </Card>
        </FadeIn>

        <ul className="grid grid-cols-2 gap-grid-mobile md:gap-grid lg:col-span-2 lg:row-span-2">
          {problems.items.map(({ icon: Icon, title, text }, index) => (
            <FadeIn as="li" key={title} delay={stagger(index, 2)}>
              <Card padding="md" className="flex h-full flex-col gap-4 md:gap-6">
                <span className="grid size-9 place-items-center rounded-full border border-border bg-surface-2 text-accent md:size-11">
                  <Icon aria-hidden className="size-4 md:size-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-balance md:text-xl">{title}</h3>
                  <p className="mt-1.5 text-sm text-pretty text-muted md:mt-2 md:text-base">{text}</p>
                </div>
              </Card>
            </FadeIn>
          ))}
        </ul>
      </div>
    </Section>
  );
}
