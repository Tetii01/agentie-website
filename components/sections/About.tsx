import { Logo } from "@/components/brand/Logo";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Media } from "@/components/ui/Media";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { getContent } from "@/content";
import type { Founder } from "@/content/site";
import { FinalCtaCard } from "./FinalCta";

/**
 * Despre, ca grid de 3 coloane:
 * stânga și mijloc, fondatorii (carduri înalte, cu poză portret);
 * dreapta, sus: „Cine suntem" + paragraful (cu conturul logo-ului în fundal); jos: CTA-ul final.
 */
export async function About() {
  const { about } = await getContent();
  const [first, second] = about.founders;

  return (
    <Section id={about.id} aria-labelledby="despre-titlu" spacing="wide">
      <ul className="grid grid-cols-2 gap-grid-mobile md:gap-grid lg:grid-cols-3 lg:grid-rows-[auto_auto]">
        <FadeIn as="li" className="col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1">
          <Card className="relative isolate h-full overflow-hidden lg:p-10">
            <div aria-hidden className="pointer-events-none absolute -right-6 -bottom-6 -z-10 select-none">
              <Logo size="display" variant="outline" />
            </div>
            <h2 id="despre-titlu" className="text-h2-mobile font-bold text-balance md:text-h2">
              {about.title}
            </h2>
            <p className="mt-4 text-base font-medium tracking-tight text-pretty text-muted md:mt-6 md:text-xl">
              <RichText text={about.text.value} strongClassName="font-medium text-foreground" />
            </p>
          </Card>
        </FadeIn>

        <FounderCard founder={first} photoLabel={about.photoPlaceholderLabel} delay={80} className="lg:col-start-1 lg:row-span-2 lg:row-start-1" />
        <FounderCard founder={second} photoLabel={about.photoPlaceholderLabel} delay={160} className="lg:col-start-2 lg:row-span-2 lg:row-start-1" />

        <FadeIn as="li" delay={80} className="col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-2">
          <FinalCtaCard className="h-full" />
        </FadeIn>
      </ul>
    </Section>
  );
}

function FounderCard({
  founder,
  photoLabel,
  delay,
  className,
}: {
  founder: Founder;
  photoLabel: string;
  delay: number;
  className: string;
}) {
  return (
    <FadeIn as="li" delay={delay} className={className}>
      <Card as="article" padding="sm" className="flex h-full flex-col">
        <Media
          image={founder.photo}
          label={photoLabel}
          shape="none"
          aspect="portrait"
          sizes="(min-width: 1024px) 420px, (min-width: 768px) 50vw, 100vw"
          className="rounded-inner border border-border"
        />
        <div className="flex flex-1 flex-col px-1.5 pt-4 pb-1.5 md:px-4 md:pt-5 md:pb-3">
          <h3 className="text-h3-mobile font-bold md:text-h3">{founder.name}</h3>
          <p className="mt-1 text-sm text-muted md:text-base">{founder.role}</p>
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-4 md:gap-2 md:pt-5">
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
  );
}
