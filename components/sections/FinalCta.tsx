import { siWhatsapp } from "simple-icons";
import { Logo } from "@/components/brand/Logo";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getContent } from "@/content";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * CTA final, ca un card: logo, „Ai un proiect?", buton spre formular și buton WhatsApp.
 * Stă în grid-ul din „Despre" (components/sections/About.tsx).
 */
export async function FinalCtaCard({ className }: { className?: string }) {
  const { contact, finalCta } = await getContent();

  return (
    <Card className={className}>
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <Logo />
        <h2 id="cta-final-titlu" className="text-h3-mobile font-bold text-balance md:text-h3">
          {finalCta.title}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href={finalCta.primary.href}>{finalCta.primary.label}</Button>
          <Button href={whatsappUrl(contact.whatsapp)} variant="secondary">
            <BrandIcon icon={siWhatsapp} className="size-4" />
            {finalCta.whatsappLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}
