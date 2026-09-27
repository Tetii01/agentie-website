import { Card } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { stats } from "@/content/site";
import { cn } from "@/lib/cn";
import { stagger } from "@/lib/stagger";

/** Cardurile late din grid-ul bento (pe desktop: primul și ultimul ocupă 2 coloane). */
const WIDE = new Set([0, 3]);

/** Cifre, în grid bento. Valorile numerice fac count-up o singură dată când intră în ecran. */
export function Stats() {
  return (
    <Section>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.items.map(({ icon: Icon, label, value, text }, index) => (
          <FadeIn as="li" key={index} delay={stagger(index)} className={cn(WIDE.has(index) && "lg:col-span-2")}>
            <Card className="flex h-full min-h-64 flex-col justify-between gap-10">
              <Icon aria-hidden className="size-6 text-muted" strokeWidth={1.75} />
              <div>
                <p className="text-sm font-medium text-accent">{label}</p>
                <p className="mt-2 text-5xl font-bold tracking-tight md:text-6xl">
                  <CountUp value={value} />
                </p>
                <p className="mt-3 text-base text-muted">{text}</p>
              </div>
            </Card>
          </FadeIn>
        ))}
      </ul>
    </Section>
  );
}
