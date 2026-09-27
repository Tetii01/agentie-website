import { Card } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { stats } from "@/content/site";
import { cn } from "@/lib/cn";
import { stagger } from "@/lib/stagger";

/** Cardurile late din grid-ul bento (doar pe desktop: primul și ultimul ocupă 2 coloane). */
const WIDE = new Set([0, 3]);

/**
 * Cifre. Mobil: grid 2×2 compact, carduri egale. Tabletă: 2×2. Desktop: bento.
 * Valorile numerice fac count-up o singură dată când intră în ecran.
 */
export function Stats() {
  return (
    <Section>
      <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
        {stats.items.map(({ icon: Icon, label, value, text }, index) => (
          <FadeIn as="li" key={index} delay={stagger(index)} className={cn(WIDE.has(index) && "lg:col-span-2")}>
            <Card padding="tight" className="flex h-full flex-col gap-4 md:min-h-64 md:justify-between md:gap-10">
              <Icon aria-hidden className="size-5 text-muted md:size-6" strokeWidth={1.75} />
              <div>
                <p className="text-xs font-medium text-accent md:text-sm">{label}</p>
                <p className="mt-1 text-stat-mobile font-bold md:mt-2 md:text-stat">
                  <CountUp value={value} />
                </p>
                <p className="mt-2 text-sm text-pretty text-muted md:mt-3 md:text-base">{text}</p>
              </div>
            </Card>
          </FadeIn>
        ))}
      </ul>
    </Section>
  );
}
