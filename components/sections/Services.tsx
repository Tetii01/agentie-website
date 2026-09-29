import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { services } from "@/content/site";
import { cn } from "@/lib/cn";
import { stagger } from "@/lib/stagger";

/**
 * Servicii, ca grid de 3 coloane (același ritm ca proiectele: un card lat + unul îngust):
 * rândul 1: cardul cu titlul (și „Ai altă idee?") + primul serviciu, lat;
 * rândul 2: celelalte trei servicii.
 */
export function Services() {
  const { custom } = services;

  return (
    <Section id={services.id} aria-labelledby="servicii-titlu" spacing="wide">
      <ul className="grid gap-grid-mobile md:grid-cols-2 md:gap-grid lg:grid-cols-3">
        <FadeIn as="li">
          <Card className="flex h-full flex-col justify-between gap-10 lg:p-10">
            <div>
              <h2 id="servicii-titlu" className="text-h2-mobile font-bold text-balance md:text-h2">
                {services.title}
              </h2>
              <p className="mt-4 text-base text-pretty text-muted md:text-lg">{services.subtitle}</p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <p className="text-lg font-semibold tracking-tight text-balance">
                {custom.title} <span className="text-muted">{custom.text}</span>
              </p>
              <Button href={custom.cta.href} variant="secondary">
                {custom.cta.label}
              </Button>
            </div>
          </Card>
        </FadeIn>

        {services.items.map((service, index) => (
          <FadeIn
            as="li"
            key={service.title}
            delay={stagger(index + 1, 3)}
            className={cn(index === 0 && "lg:col-span-2", index === 3 && "md:col-span-2 lg:col-span-1")}
          >
            <Card className="flex h-full flex-col justify-between gap-10 md:min-h-96">
              <div>
                <p className="text-label font-medium text-accent tabular-nums">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-h3-mobile font-bold text-balance md:text-h3">{service.title}</h3>
                <p className={cn("mt-4 text-base text-pretty text-muted md:text-lg", index === 0 && "max-w-xl")}>
                  {service.description}
                </p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <li key={tag}>
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
            </Card>
          </FadeIn>
        ))}
      </ul>
    </Section>
  );
}
