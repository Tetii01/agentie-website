import { ScanSearch } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SmartLink } from "@/components/ui/SmartLink";
import { getContent } from "@/content";

/**
 * Header fix, tip sticlă. Desktop: logo · meniu · buton „Analiză gratuită".
 * Mobil: logo + buton compact cu iconiță (meniul se ascunde).
 * `data-site-header` e folosit la calculul offset-ului pentru scroll (lib/scroll.ts).
 */
export async function Header() {
  const { brand, nav, ui } = await getContent();

  return (
    <header
      data-site-header
      className="fixed inset-x-0 top-0 z-50 border-b border-glass-border bg-glass backdrop-blur-[50px] transition-colors duration-base"
    >
      <Container className="flex h-header-mobile items-center justify-between gap-6 md:grid md:h-header md:grid-cols-[1fr_auto_1fr]">
        {/* data-intro-target: aici aterizează logo-ul din intro (components/sections/Intro.tsx). */}
        <SmartLink href="#top" aria-label={brand.name} data-intro-target className="justify-self-start rounded-pill">
          <Logo />
        </SmartLink>

        <nav aria-label={ui.mainNav} className="hidden md:block">
          <ul className="flex items-center gap-10">
            {nav.links.map((link) => (
              <li key={link.href}>
                <SmartLink
                  href={link.href}
                  className="text-sm font-medium text-muted transition-colors duration-base hover:text-foreground"
                >
                  {link.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="justify-self-end">
          {/* Vizibilitatea stă pe <span>, nu pe Button, ca să nu intre în conflict cu inline-flex din Button. */}
          <span className="hidden md:block">
            <Button href={nav.cta.href} size="sm">
              {nav.cta.label}
            </Button>
          </span>
          <span className="md:hidden">
            <Button href={nav.cta.href} size="icon" aria-label={nav.cta.label}>
              <ScanSearch aria-hidden className="size-5" />
            </Button>
          </span>
        </div>
      </Container>
    </header>
  );
}
