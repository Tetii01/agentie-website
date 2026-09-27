import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { LogoLoop } from "@/components/ui/LogoLoop";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contact, offer, ui } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { LeadForm, type LeadFormTexts } from "./LeadForm";

/** Analiză gratuită: card mare cu titlu, lista de beneficii și formularul în 2 pași. */
export function Offer() {
  const texts: LeadFormTexts = {
    form: offer.form,
    ui: ui.form,
    newTabLabel: ui.externalLink,
    whatsappUrl: whatsappUrl(contact.whatsapp),
  };

  return (
    <Section id={offer.id} aria-labelledby="analiza-titlu">
      <FadeIn>
        <Card className="lg:p-14">
          {/* minmax(0,…): coloanele nu se lărgesc după banda de beneficii (lățime max-content) de pe mobil. */}
          <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow={offer.eyebrow}
                title={offer.title}
                subtitle={offer.subtitle}
                titleId="analiza-titlu"
                align="left"
                animate={false}
              />
              <Benefits />
            </div>
            <LeadForm texts={texts} />
          </div>
        </Card>
      </FadeIn>

      <FadeIn className="mt-8">
        <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted md:text-base">
          <span>{offer.alternative}</span>
          <a href={contact.phone.href} className="text-foreground transition-colors duration-base hover:text-accent">
            {contact.phone.label}
          </a>
          <span aria-hidden>·</span>
          <a href={contact.email.href} className="text-foreground transition-colors duration-base hover:text-accent">
            {contact.email.label}
          </a>
        </p>
      </FadeIn>
    </Section>
  );
}

/** Beneficiile: bandă care se derulează lent pe mobil, listă de la tabletă în sus. */
function Benefits() {
  const item = (text: string) => (
    <span className="flex items-center gap-2 text-sm whitespace-nowrap text-foreground md:text-base md:whitespace-normal">
      <Check aria-hidden className="size-4 shrink-0 text-accent" strokeWidth={2.5} />
      {text}
    </span>
  );

  return (
    <>
      <div className="mt-8 md:hidden">
        <LogoLoop items={offer.benefits.map((text) => ({ key: text, node: item(text) }))} />
      </div>
      <ul className="mt-10 hidden flex-col gap-4 md:flex">
        {offer.benefits.map((text) => (
          <li key={text}>{item(text)}</li>
        ))}
      </ul>
    </>
  );
}
