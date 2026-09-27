import { Logo } from "@/components/brand/Logo";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Container } from "@/components/ui/Container";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { SmartLink } from "@/components/ui/SmartLink";
import { brand, footer, ui } from "@/content/site";

const linkClasses = "text-sm text-muted transition-colors duration-base hover:text-foreground";

/** Footer comun (prima pagină + paginile legale). */
export function Footer() {
  return (
    <footer className="border-t border-border">
      {/* pb mare: ultimul rând trebuie să poată urca deasupra CTA-ului plutitor (fix jos). */}
      <Container className="flex flex-col gap-10 pt-12 pb-28 md:pt-16 md:pb-32">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <SmartLink href="#top" aria-label={brand.name} className="self-start rounded-pill">
              <Logo />
            </SmartLink>
            <p className="text-sm text-muted">
              © {brand.name}. {footer.rights} <CurrentYear fallback={new Date().getFullYear()} />.
            </p>
          </div>

          <nav aria-label={ui.footerNav} className="flex flex-col gap-6 sm:flex-row sm:gap-16">
            <ul className="flex flex-col gap-2">
              {footer.legalLinks.map((link) => (
                <li key={link.href}>
                  <SmartLink href={link.href} className={linkClasses}>
                    {link.label}
                  </SmartLink>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-2">
              {footer.anpcLinks.map((link) => (
                <li key={link.href}>
                  <SmartLink href={link.href} className={linkClasses}>
                    {link.label}
                    <span className="sr-only"> {ui.externalLink}</span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          <ul aria-label={ui.socialLinks} className="flex gap-3">
            {footer.social.map((social) => (
              <li key={social.name}>
                <SmartLink
                  href={social.href}
                  aria-label={social.name}
                  className="grid size-10 place-items-center rounded-full border border-border text-muted transition-colors duration-base hover:border-foreground/30 hover:text-foreground"
                >
                  <BrandIcon icon={social.icon} className="size-4" />
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted">{footer.companyLine}</p>
      </Container>
    </footer>
  );
}
