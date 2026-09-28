import { Logo } from "@/components/brand/Logo";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Container } from "@/components/ui/Container";
import { CurrentYear } from "@/components/ui/CurrentYear";
import { SmartLink } from "@/components/ui/SmartLink";
import { brand, footer, ui } from "@/content/site";

const linkClasses = "text-sm text-foreground transition-colors duration-base hover:text-accent";

/** Footer comun (prima pagină + paginile legale): totul pe centru, fără linii de separare. */
export function Footer() {
  return (
    <footer className="mt-16 md:mt-24">
      {/* pb mare: ultimul rând trebuie să poată urca deasupra CTA-ului plutitor (fix jos). */}
      <Container className="flex flex-col items-center gap-6 pb-32 text-center md:pb-44">
        <SmartLink href="#top" aria-label={brand.name} className="rounded-pill">
          <Logo />
        </SmartLink>

        <nav aria-label={ui.footerNav}>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
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

        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">
            © <span className="text-accent">{brand.name}</span>. {footer.rights}{" "}
            <CurrentYear fallback={new Date().getFullYear()} />.
          </p>
          <p className="text-xs text-muted">{footer.companyLine}</p>
        </div>
      </Container>
    </footer>
  );
}
