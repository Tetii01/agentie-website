import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { problems } from "@/content/site";
import { stagger } from "@/lib/stagger";

export function Problems() {
  return (
    <Section id={problems.id} aria-labelledby="probleme-titlu">
      <SectionHeading title={problems.title} titleId="probleme-titlu" />

      <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
        {problems.items.map(({ icon: Icon, title, text }, index) => (
          <FadeIn as="li" key={title} delay={stagger(index)}>
            <Card className="h-full">
              <span className="grid size-12 place-items-center rounded-full border border-border bg-surface-2 text-foreground">
                <Icon aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-balance md:mt-8 md:text-2xl">{title}</h3>
              <p className="mt-3 text-base text-pretty text-muted md:text-lg">{text}</p>
            </Card>
          </FadeIn>
        ))}
      </ul>

      <FadeIn className="mt-16 md:mt-24">
        <p className="mx-auto max-w-3xl text-center text-2xl font-semibold tracking-tight text-balance md:text-4xl">
          {problems.closing}
        </p>
      </FadeIn>
    </Section>
  );
}
