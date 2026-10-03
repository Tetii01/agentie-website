import { siInstagram } from "simple-icons";
import { Logo } from "@/components/brand/Logo";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Card } from "@/components/ui/Card";
import { FadeIn } from "@/components/ui/FadeIn";
import { Media } from "@/components/ui/Media";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";
import { getContent } from "@/content";
import type { Founder } from "@/content/site";
import { stagger } from "@/lib/stagger";
import { displayDomain } from "@/lib/url";

/**
 * Despre: componenta „Team Section" de pe 21st.dev (ravikatiyar162/team-section-1), așezată într-un card
 * standard al site-ului (Card). Structura, dimensiunile și animațiile din interior sunt cele din preview-ul
 * lor pe dark, iar culorile textelor sunt tokens-urile `team-*` din app/globals.css: excepție cerută de Teti
 * de la designul site-ului. Doar titlul („Cine suntem") are stilul titlurilor din celelalte secțiuni.
 *
 * Față de original: 2 membri în loc de 3 (aceeași lățime de card și aceeași distanță, centrați),
 * fără butonul de sub logo, fără grila și fundalul mai închis, doar Instagram ca rețea a firmei,
 * fiecare element stă în FadeIn, pozele trec prin Media (next/image), iar linkul de Instagram
 * al fiecărui membru e vizibil mereu pe ecranele fără hover (telefon).
 */
export async function About() {
  const { about, footer, ui } = await getContent();
  const instagram = footer.social.filter((social) => social.icon === siInstagram);

  return (
    <Section id={about.id} aria-labelledby="despre-titlu" spacing="wide">
      <FadeIn>
        <Card className="grid items-center justify-center gap-8 text-center">
          {/* Stânga: titlul și paragraful. Dreapta: logo-ul. */}
          <div className="relative z-10 flex w-full flex-col items-center justify-between gap-4 md:flex-row md:items-start md:text-left lg:gap-8">
            <div className="grid gap-2 text-center md:text-left">
              <FadeIn>
                {/* Titlul are stilul titlurilor din celelalte secțiuni. */}
                <h2 id="despre-titlu" className="text-h2-mobile font-bold text-balance md:text-h2 text-metal">
                  {about.title}
                </h2>
              </FadeIn>
              <FadeIn delay={stagger(1)}>
                <p className="max-w-[700px] text-team-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {/* Ca în original, paragraful e simplu: cuvintele marcate cu ** ** în content nu sunt evidențiate aici. */}
                  <RichText text={about.text.value} strongClassName="font-normal" />
                </p>
              </FadeIn>
            </div>

            <div className="flex flex-col items-center gap-4 md:items-end">
              {/* Logo-ul stă într-un rând de 32px, cât ocupa textul-logo din original. */}
              <FadeIn delay={stagger(2)} className="flex h-8 items-center">
                <Logo />
              </FadeIn>
            </div>
          </div>

          {/* Instagramul firmei, cu linkul din footer. Cât linkul e încă placeholder („[URL …]"), iconița apare fără link. */}
          <FadeIn className="relative z-10 flex w-full items-center justify-center gap-4 py-4 md:justify-center">
            {instagram.map((social) =>
              displayDomain(social.href) ? (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-team-muted-foreground transition-colors hover:text-team-primary"
                >
                  <BrandIcon icon={social.icon} className="h-6 w-6" />
                  <span className="sr-only">
                    {social.name} {ui.externalLink}
                  </span>
                </a>
              ) : (
                <span key={social.name} className="text-team-muted-foreground">
                  <BrandIcon icon={social.icon} title={social.name} className="h-6 w-6" />
                </span>
              ),
            )}
          </FadeIn>

          {/*
            Membrii: fiecare card are lățimea unei coloane din grila de 3 a originalului, iar cele 2 carduri stau centrate.
            720px și 901px sunt lățimile conținutului din preview-ul original (pe tabletă, respectiv de la lg în sus):
            cardurile au exact lățimea de acolo (219px, respectiv 268px), indiferent cât de lat e cardul nostru.
          */}
          <ul className="relative z-10 mx-auto grid w-full grid-cols-1 gap-8 md:grid-cols-[repeat(2,calc((720px-4rem)/3))] md:justify-center lg:grid-cols-[repeat(2,calc((901px-6rem)/3))] lg:gap-12">
            {about.founders.map((founder, index) => (
              <FadeIn as="li" key={founder.name} delay={stagger(index)}>
                <MemberCard founder={founder} index={index} />
              </FadeIn>
            ))}
          </ul>
        </Card>
      </FadeIn>
    </Section>
  );
}

/**
 * Card de membru: poza rotundă, numele, rolul și iconița de Instagram.
 * La hover: cardul crește puțin, de jos urcă un gradient, poza primește contur și se mărește, iar iconița apare.
 * Întârzierile cresc cu poziția cardului, ca în original. Cu „reduce motion": fără mișcare, doar conturul și iconița.
 */
async function MemberCard({ founder, index }: { founder: Founder; index: number }) {
  const { about, ui } = await getContent();

  return (
    <article className="group relative flex h-full flex-col items-center justify-end overflow-hidden rounded-team-card p-6 text-center text-team-foreground shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl motion-safe:hover:scale-[1.02] motion-reduce:transition-none">
      <div
        aria-hidden
        className="absolute right-0 bottom-0 left-0 h-1/2 origin-bottom scale-y-0 rounded-t-full bg-linear-to-t from-team-primary/20 to-transparent transition-transform duration-500 ease-out motion-safe:group-hover:scale-y-100 motion-reduce:transition-none"
        style={{ transitionDelay: `${index * 50}ms` }}
      />

      <div
        className="relative z-10 h-36 w-36 overflow-hidden rounded-full border-4 border-transparent bg-team-background/20 transition-all duration-500 ease-out group-hover:border-team-primary motion-safe:group-hover:scale-105 motion-reduce:transition-none"
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        <Media
          image={founder.photo}
          label={about.photoPlaceholderLabel}
          shape="none"
          aspect="fill"
          sizes="136px"
          className="transition-transform duration-500 ease-out motion-safe:group-hover:scale-110 motion-reduce:transition-none"
        />
      </div>

      <h3 className="relative z-10 mt-4 text-xl font-semibold text-team-foreground">{founder.name}</h3>
      <p className="relative z-10 text-sm text-team-muted-foreground">{founder.role}</p>

      {/* Cu mouse: apare la hover (sau la focus din tastatură). Fără hover (telefon): vizibilă mereu. */}
      <div className="relative z-10 mt-4 flex gap-3 transition-opacity duration-300 ease-in-out group-hover:opacity-100 focus-within:opacity-100 motion-reduce:transition-none [@media(hover:hover)]:opacity-0">
        <a
          href={founder.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative text-team-muted-foreground transition-colors after:absolute after:-inset-3 hover:text-team-primary"
        >
          <BrandIcon icon={siInstagram} className="h-5 w-5" />
          <span className="sr-only">
            {founder.instagram.handle} {ui.onInstagram} {ui.externalLink}
          </span>
        </a>
      </div>
    </article>
  );
}
