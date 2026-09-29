import { Check, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { LogoLoop } from "@/components/ui/LogoLoop";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { contact, offer, stats, ui } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { LeadForm, type LeadFormTexts } from "./LeadForm";
import { StatCard } from "./Stats";

/**
 * Analiza gratuită, în mijlocul unui grid de 3 coloane, cu cifrele în jur:
 * stânga și dreapta câte două carduri cu cifre, la mijloc cardul înalt cu titlul, beneficiile și formularul.
 * Pe mobil: cifrele 2×2, cu cardul analizei între ele, pe toată lățimea.
 */
export function Offer() {
  const texts: LeadFormTexts = {
    form: offer.form,
    ui: ui.form,
    newTabLabel: ui.externalLink,
    whatsappUrl: whatsappUrl(contact.whatsapp),
  };
  const [first, second, third, fourth] = stats.items;

  return (
    <Section id={offer.id} aria-labelledby="analiza-titlu" spacing="wide">
      {/* minmax(0,…): coloanele nu se lărgesc după banda de beneficii (lățime max-content). */}
      <ul className="grid grid-cols-2 gap-grid-mobile md:gap-grid lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,0.8fr)] lg:grid-rows-2">
        <StatCard stat={first} className="lg:col-start-1 lg:row-start-1" />
        <StatCard stat={second} delay={80} className="lg:col-start-1 lg:row-start-2" />

        <FadeIn as="li" className="col-span-2 lg:col-span-1 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Card padding="none" className="flex h-full flex-col px-4 py-6 md:p-8 lg:px-8 lg:py-10">
            <div className="flex flex-col items-center text-center">
              <p className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface-2 px-3.5 py-1.5 text-label font-medium text-foreground">
                <Sparkles aria-hidden className="size-3.5 text-accent" />
                {offer.eyebrow}
              </p>
              <h2 id="analiza-titlu" className="mt-5 text-h2-mobile font-bold text-balance md:text-h2">
                <RichText text={offer.title} strongClassName="font-bold text-accent" />
              </h2>
              <p className="mt-3 max-w-md text-sm text-pretty text-muted md:mt-4 md:text-base">{offer.subtitle}</p>
            </div>

            <LogoLoop
              className="mt-6 md:mt-8"
              items={offer.benefits.map((text) => ({
                key: text,
                node: (
                  <span className="flex items-center gap-2 text-sm whitespace-nowrap text-foreground">
                    <Check aria-hidden className="size-4 shrink-0 text-accent" strokeWidth={2.5} />
                    {text}
                  </span>
                ),
              }))}
            />

            <div className="mt-6 rounded-inner border border-border bg-background/60 p-4 md:mt-8 md:p-6">
              <LeadForm texts={texts} />
            </div>

            <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted">
              <span>{offer.alternative}</span>
              <a href={contact.phone.href} className="text-foreground transition-colors duration-base hover:text-accent">
                {contact.phone.label}
              </a>
              <span aria-hidden>·</span>
              <a href={contact.email.href} className="text-foreground transition-colors duration-base hover:text-accent">
                {contact.email.label}
              </a>
            </p>
          </Card>
        </FadeIn>

        <StatCard stat={third} delay={80} className="lg:col-start-3 lg:row-start-1" />
        <StatCard stat={fourth} delay={160} className="lg:col-start-3 lg:row-start-2" />
      </ul>
    </Section>
  );
}
