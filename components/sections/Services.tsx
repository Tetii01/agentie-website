import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { getContent } from "@/content";
import { cn } from "@/lib/cn";
import { stagger } from "@/lib/stagger";

/**
 * Servicii, ca grid de 3 coloane (același ritm ca proiectele: un card lat + unul îngust):
 * rândul 1: cardul cu titlul (și „Ai altă idee?") + primul serviciu, lat;
 * rândul 2: celelalte trei servicii.
 */
/** Serviciile 2 și 3 stau pe jumătate de lățime pe telefon (grid de 2 coloane). */
const halfOnMobile = (index: number) => index === 1 || index === 2;

export async function Services() {
  const { services } = await getContent();
  const { custom } = services;

  return (
    <Section id={services.id} aria-labelledby="servicii-titlu" spacing="wide">
      <ul className="grid grid-cols-2 gap-grid-mobile md:gap-grid lg:grid-cols-3">
        <FadeIn as="li" className="col-span-2 md:col-span-1">
          <Card className="flex h-full flex-col justify-between gap-6 md:gap-10 lg:p-10">
            <div>
              <h2 id="servicii-titlu" className="text-h2-mobile font-bold text-balance md:text-h2 text-metal">
                {services.title}
              </h2>
              <p className="mt-3 text-sm text-pretty text-muted md:mt-4 md:text-lg">{services.subtitle}</p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <p className="text-base font-semibold tracking-tight text-balance md:text-lg">
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
            className={cn(index === 0 && "col-span-2 md:col-span-1 lg:col-span-2", index === 3 && "col-span-2 lg:col-span-1")}
          >
            <Card className="flex h-full flex-col justify-between gap-6 md:min-h-96 md:gap-10">
              <div>
                <h3 className="text-h3-mobile font-bold text-balance md:text-h3">{service.title}</h3>
                <p className={cn("mt-3 text-sm text-pretty text-muted md:mt-4 md:text-lg", index === 0 && "max-w-xl")}>
                  {service.description}
                </p>
              </div>
              {/* Pe telefon, cardurile pe jumătate de lățime (2 și 3) arată etichetele ca un rând de text,
                  ca să nu stea câte una pe rând; de la tabletă în sus, pilule ca la celelalte. */}
              {halfOnMobile(index) && (
                <p className="text-xs text-pretty text-muted md:hidden">{service.tags.join(" · ")}</p>
              )}
              <ul className={cn("flex flex-wrap gap-2", halfOnMobile(index) && "hidden md:flex")}>
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
