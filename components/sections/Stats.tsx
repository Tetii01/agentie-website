import { Card } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { FadeIn } from "@/components/ui/FadeIn";
import type { Stat } from "@/content/site";
import { cn } from "@/lib/cn";

type StatCardProps = {
  stat: Stat;
  /** Poziția în grid (ex. „lg:col-start-1 lg:row-start-2"). */
  className?: string;
  delay?: number;
};

/**
 * O cifră, ca un card mic cu conținutul pe centru: iconiță, etichetă în accent, valoarea mare, textul.
 * Folosit în jurul cardului cu analiza gratuită (components/sections/Offer.tsx).
 * Valorile numerice fac count-up o singură dată când intră în ecran.
 */
export function StatCard({ stat: { icon: Icon, label, value, text }, className, delay }: StatCardProps) {
  return (
    <FadeIn as="li" delay={delay} className={className}>
      <Card
        padding="tight"
        className={cn("flex h-full flex-col items-center justify-center gap-3 text-center md:min-h-64 md:gap-4")}
      >
        <Icon aria-hidden className="size-5 text-foreground md:size-6" strokeWidth={1.75} />
        <p className="text-label font-medium text-accent">{label}</p>
        <div>
          <p className="text-stat-mobile font-bold md:text-stat">
            <CountUp value={value} />
          </p>
          <p className="mt-1 text-base font-semibold tracking-tight text-balance md:text-xl">{text}</p>
        </div>
      </Card>
    </FadeIn>
  );
}
