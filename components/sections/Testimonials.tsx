import { BadgeCheck, Star } from "lucide-react";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Carousel } from "@/components/ui/Carousel";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { FadeIn } from "@/components/ui/FadeIn";
import { LogoLoop } from "@/components/ui/LogoLoop";
import { Media } from "@/components/ui/Media";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { getContent } from "@/content";
import type { Testimonial } from "@/content/site";

/**
 * Testimoniale, într-un singur container mare:
 * - sus: cardul cu nota (stânga, fix) + rândul de testimoniale;
 * - sub ele: bulinele și săgețile, la fel ca la proiecte;
 * - jos: banda cu tool-urile pe care le integrăm.
 * Pe mobil, câte un testimonial pe pagină; rândul se glisează și cu degetul.
 */
export async function Testimonials() {
  const { testimonials, tools, ui } = await getContent();

  return (
    <Section aria-labelledby="testimoniale-titlu">
      <h2 id="testimoniale-titlu" className="sr-only">
        {testimonials.label}
      </h2>

      <FadeIn>
        <div className="panel-surface flex flex-col gap-3 rounded-card p-3 md:gap-4 md:p-4">
          <Carousel
            labels={ui.carousel}
            label={testimonials.label}
            leading={<RatingCard />}
            listClassName="gap-3 md:gap-4 md:[mask-image:linear-gradient(to_right,black_93%,transparent)]"
          >
            {testimonials.items.map((item, index) => (
              <li key={index} className="w-[85%] shrink-0 snap-start md:w-85 lg:w-105">
                <TestimonialCard item={item} />
              </li>
            ))}
          </Carousel>

          <div className="py-3 md:py-4">
            <LogoLoop
              label={tools.label}
              items={tools.items.map((tool) => ({
                key: tool.name,
                node: (
                  <BrandIcon
                    icon={tool.icon}
                    title={tool.name}
                    className="size-6 text-foreground opacity-45 transition-opacity duration-base hover:opacity-100 md:size-7"
                  />
                ),
              }))}
            />
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}

/** Cardul din stânga: nota mare, 5 stele și un rând scurt. Pe mobil stă pe orizontală, deasupra rândului. */
async function RatingCard() {
  const { testimonials } = await getContent();
  const { rating } = testimonials;

  return (
    <div className="card-surface flex flex-none items-center gap-5 rounded-card-sm px-5 py-4 md:w-50 md:flex-col md:justify-center md:gap-3 md:px-5 md:pt-10 md:pb-8 md:text-center">
      <span className="text-stat-mobile font-bold tabular-nums md:text-stat">{rating.value}</span>
      <div className="flex flex-col gap-2 md:items-center md:gap-3">
        <span aria-hidden className="flex gap-1 text-accent">
          {Array.from({ length: 5 }, (_, star) => (
            <Star key={star} className="size-3.5 fill-current" />
          ))}
        </span>
        <p className="text-sm text-pretty">
          <RichText text={rating.text} strongClassName="font-medium text-accent" />
        </p>
      </div>
    </div>
  );
}

/** Un testimonial: avatar, nume (+ bifă), urmăritori / rol, citatul, contul și linkul. */
async function TestimonialCard({ item }: { item: Testimonial }) {
  const { testimonials, ui } = await getContent();

  return (
    <article className="card-surface flex h-full flex-col gap-4 rounded-card-sm p-5 md:min-h-72 md:gap-5 md:px-6 md:py-6.5">
      <div className="flex items-center gap-4">
        <Media
          image={item.avatar}
          label={testimonials.avatarPlaceholderLabel}
          shape="circle"
          aspect="square"
          compact
          sizes="54px"
          className="size-11 shrink-0 md:size-13.5"
        />
        <div className="min-w-0 text-sm">
          <p className="flex items-center gap-1.5 text-base font-medium">
            {item.name}
            {item.verified && <BadgeCheck aria-hidden className="size-4 text-accent" />}
          </p>
          <p className="mt-0.5 font-medium">
            {item.followers && (
              <>
                <i className="text-accent">{item.followers}</i>
                <span aria-hidden className="mx-1 opacity-40">
                  /
                </span>
              </>
            )}
            <span>{item.role}</span>
          </p>
        </div>
      </div>

      <blockquote className="text-base font-medium text-pretty text-muted md:text-lead">
        <p>
          <RichText text={item.quote} strongClassName="font-medium text-dot-active" />
        </p>
      </blockquote>

      <div className="mt-auto flex items-center justify-between gap-4 text-sm">
        {item.handle && <span className="text-accent">{item.handle}</span>}
        <ExternalLink url={item.url} newTabLabel={ui.externalLink} className="ml-auto" />
      </div>
    </article>
  );
}
