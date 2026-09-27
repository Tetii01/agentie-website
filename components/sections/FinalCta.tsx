import { siWhatsapp } from "simple-icons";
import { Logo } from "@/components/brand/Logo";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { Section } from "@/components/ui/Section";
import { contact, finalCta } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";

/** CTA final: logo mare, „Ai un proiect?", buton spre formular și buton WhatsApp. */
export function FinalCta() {
  return (
    <Section aria-labelledby="cta-final-titlu">
      <div className="flex flex-col items-center text-center">
        <FadeIn>
          <Logo size="xl" />
        </FadeIn>
        <FadeIn delay={80}>
          <h2 id="cta-final-titlu" className="mt-6 text-h2-mobile font-bold text-balance md:mt-8 md:text-h2">
            {finalCta.title}
          </h2>
        </FadeIn>
        <FadeIn delay={160} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Button href={finalCta.primary.href} size="lg">
            {finalCta.primary.label}
          </Button>
          <Button href={whatsappUrl(contact.whatsapp)} variant="secondary" size="lg">
            <BrandIcon icon={siWhatsapp} className="size-5" />
            {finalCta.whatsappLabel}
          </Button>
        </FadeIn>
      </div>
    </Section>
  );
}
