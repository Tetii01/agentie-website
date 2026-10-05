import type { ReactNode } from "react";
import { siWhatsapp } from "simple-icons";
import { Logo } from "@/components/brand/Logo";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Container } from "@/components/ui/Container";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { FadeIn } from "@/components/ui/FadeIn";
import { SmartLink } from "@/components/ui/SmartLink";
import { getContent } from "@/content";
import { whatsappUrl } from "@/lib/whatsapp";

const linkClasses =
  "inline-flex items-center gap-2 text-sm text-muted transition-colors duration-base ease-smooth hover:text-foreground";

/**
 * Footer comun (prima pagină + paginile legale), după „footer section" (efferd), adaptat la site:
 * colțuri mari sus, o linie fină pe margine, o lumină moale care cade din mijloc și, sus, o linie care strălucește.
 * Stânga: logo și ©. Dreapta: patru coloane (navigare, contact, legal, social).
 * Fiecare bloc apare cu un fade din blur, unul după altul (FadeIn variant="blur").
 */
export async function Footer() {
  const { brand, nav, contact, finalCta, footer, ui } = await getContent();
  const { headings } = footer;

  return (
    <footer className="mt-[calc(var(--spacing-section-gap-mobile)-var(--spacing-section-mobile))] md:mt-[calc(var(--spacing-section-gap)-var(--spacing-section))]">
      <Container>
        {/* pb mare: ultimul rând trebuie să poată urca deasupra CTA-ului plutitor (fix jos). */}
        <div className="footer-surface relative px-6 pt-12 pb-32 md:px-12 md:pt-16 md:pb-40">
          <div
            aria-hidden
            className="absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/25 blur-sm"
          />

          <div className="grid gap-12 xl:grid-cols-3 xl:gap-8">
            <FadeIn variant="blur" className="flex flex-col items-start gap-5">
              <SmartLink href="#top" aria-label={brand.name} className="rounded-pill">
                <Logo />
              </SmartLink>
              <p className="text-sm text-muted">
                © {brand.name}. {footer.rights} <CurrentYear fallback={new Date().getFullYear()} />.
              </p>
            </FadeIn>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 xl:col-span-2">
              <FadeIn variant="blur" delay={100}>
                <FooterColumn title={headings.navigation}>
                  {[...nav.links, nav.cta].map((link) => (
                    <li key={link.href + link.label}>
                      <SmartLink href={link.href} className={linkClasses}>
                        {link.label}
                      </SmartLink>
                    </li>
                  ))}
                </FooterColumn>
              </FadeIn>

              <FadeIn variant="blur" delay={200}>
                <FooterColumn title={headings.contact}>
                  <li>
                    <SmartLink href={contact.phone.href} className={linkClasses}>
                      {contact.phone.label}
                    </SmartLink>
                  </li>
                  <li>
                    <SmartLink href={whatsappUrl(contact.whatsapp)} className={linkClasses}>
                      <BrandIcon icon={siWhatsapp} className="size-4" />
                      {finalCta.whatsappLabel}
                      <span className="sr-only"> {ui.externalLink}</span>
                    </SmartLink>
                  </li>
                </FooterColumn>
              </FadeIn>

              <FadeIn variant="blur" delay={300}>
                <nav aria-label={ui.footerNav}>
                  <FooterColumn title={headings.legal}>
                    {footer.legalLinks.map((link) => (
                      <li key={link.href}>
                        <SmartLink href={link.href} className={linkClasses}>
                          {link.label}
                        </SmartLink>
                      </li>
                    ))}
                    {footer.anpcLinks.map((link) => (
                      <li key={link.href}>
                        <SmartLink href={link.href} className={linkClasses}>
                          {link.label}
                          <span className="sr-only"> {ui.externalLink}</span>
                        </SmartLink>
                      </li>
                    ))}
                  </FooterColumn>
                </nav>
              </FadeIn>

              <FadeIn variant="blur" delay={400}>
                <FooterColumn title={headings.social} label={ui.socialLinks}>
                  {footer.social.map((social) => (
                    <li key={social.name}>
                      <SmartLink href={social.href} className={linkClasses}>
                        <BrandIcon icon={social.icon} className="size-4" />
                        {social.name}
                      </SmartLink>
                    </li>
                  ))}
                </FooterColumn>
              </FadeIn>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

/** O coloană: titlu mic și lista de linkuri. */
function FooterColumn({ title, label, children }: { title: string; label?: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-medium tracking-wide text-foreground">{title}</h3>
      <ul aria-label={label} className="mt-4 flex flex-col gap-2.5">
        {children}
      </ul>
    </div>
  );
}
