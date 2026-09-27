import { Logo } from "@/components/brand/Logo";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Media } from "@/components/ui/Media";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { about } from "@/content/site";
import { stagger } from "@/lib/stagger";

/** Despre: conturul mare al logo-ului în fundal, fondatorii și un paragraf cu cuvinte evidențiate. */
export function About() {
  return (
    <Section id={about.id} aria-labelledby="despre-titlu" className="relative overflow-x-clip">
      {/* Contur decorativ al logo-ului, în spatele titlului. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-10 flex justify-center select-none md:top-16">
        <Logo size="display" variant="outline" />
      </div>

      <div className="relative">
        <SectionHeading title={about.title} titleId="despre-titlu" />

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
          {about.founders.map((founder, index) => (
            <FadeIn as="li" key={founder.name} delay={stagger(index)}>
              <Card as="article" padding="sm" className="h-full">
                <Media
                  image={founder.photo}
                  label={about.photoPlaceholderLabel}
                  shape="none"
                  aspect="landscape"
                  sizes="(min-width: 768px) 576px, 100vw"
                  className="rounded-inner border border-border"
                />
                <div className="px-3 pt-5 pb-3 md:px-4">
                  <h3 className="text-2xl font-bold tracking-tight">{founder.name}</h3>
                  <p className="mt-1 text-muted">{founder.role}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {founder.highlights.map((highlight) => (
                      <li key={highlight}>
                        <Tag>
                          <span>
                            <RichText text={highlight} strongClassName="font-semibold text-foreground" />
                          </span>
                        </Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </FadeIn>
          ))}
        </ul>

        <FadeIn className="mt-16 md:mt-24">
          <p className="mx-auto max-w-4xl text-center text-2xl font-medium tracking-tight text-balance text-muted md:text-4xl">
            <RichText text={about.text.value} strongClassName="font-medium text-foreground" />
          </p>
        </FadeIn>
      </div>
    </Section>
  );
}
