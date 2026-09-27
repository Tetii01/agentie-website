import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { services } from "@/content/site";
import { stagger } from "@/lib/stagger";

export function Services() {
  const { custom } = services;

  return (
    <Section id={services.id} aria-labelledby="servicii-titlu">
      <SectionHeading title={services.title} subtitle={services.subtitle} titleId="servicii-titlu" />

      <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
        {services.items.map((service, index) => (
          <FadeIn as="li" key={service.title} delay={stagger(index)}>
            <Card className="flex h-full flex-col justify-between gap-10 md:min-h-96">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-balance md:text-3xl">{service.title}</h3>
                <p className="mt-4 text-base text-pretty text-muted md:text-lg">{service.description}</p>
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

      {/* Cardul lat, mai discret: „Ai altă idee?" */}
      <FadeIn className="mt-4">
        <Card variant="subtle" className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xl font-semibold tracking-tight text-balance md:text-2xl">
            {custom.title} <span className="text-muted">{custom.text}</span>
          </p>
          <Button href={custom.cta.href} variant="secondary">
            {custom.cta.label}
          </Button>
        </Card>
      </FadeIn>
    </Section>
  );
}
