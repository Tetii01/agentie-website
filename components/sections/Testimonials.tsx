import { Card } from "@/components/ui/Card";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { FadeIn } from "@/components/ui/FadeIn";
import { Media } from "@/components/ui/Media";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { testimonials, ui } from "@/content/site";
import { stagger } from "@/lib/stagger";

/**
 * Testimoniale / colaborări: doar o etichetă mică, fără titlu mare.
 * Pe mobil, rând cu scroll orizontal; de la tabletă în sus, grid.
 * `data-lenis-prevent-horizontal`: gesturile orizontale din rând rămân native,
 * iar scroll-ul vertical al paginii rămâne lin și când mouse-ul e deasupra rândului.
 */
export function Testimonials() {
  return (
    <Section aria-labelledby="testimoniale-titlu">
      <FadeIn>
        <Eyebrow id="testimoniale-titlu" className="text-center">
          {testimonials.label}
        </Eyebrow>
      </FadeIn>

      <ul
        data-lenis-prevent-horizontal
        data-fade-group
        className="-mx-gutter mt-8 flex snap-x snap-mandatory scroll-px-gutter gap-4 overflow-x-auto px-gutter pb-2 md:mx-0 md:mt-10 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4"
      >
        {testimonials.items.map((item, index) => (
          <FadeIn as="li" key={index} delay={stagger(index)} className="w-[85%] shrink-0 snap-start md:w-auto">
            <Card as="article" padding="md" className="flex h-full flex-col gap-6">
              <div className="flex items-center gap-4">
                <Media
                  image={item.avatar}
                  label={testimonials.avatarPlaceholderLabel}
                  shape="circle"
                  aspect="square"
                  compact
                  sizes="48px"
                  className="size-12 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted">{item.role}</p>
                  {item.followers && <p className="mt-0.5 text-xs font-medium text-accent">{item.followers}</p>}
                </div>
              </div>

              <blockquote className="text-base text-pretty text-muted">
                <p>
                  <RichText text={item.quote} />
                </p>
              </blockquote>

              <ExternalLink url={item.url} newTabLabel={ui.externalLink} className="mt-auto" />
            </Card>
          </FadeIn>
        ))}
      </ul>
    </Section>
  );
}
