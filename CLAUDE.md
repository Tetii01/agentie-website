@AGENTS.md

# Site-ul agenției

Spec-ul complet e în [docs/SPEC.md](docs/SPEC.md). Citește-l înainte de orice modificare.

## Cum lucrăm

- Lucrăm pe faze (SPEC §8). Faci doar faza cerută, apoi te oprești și aștepți.
- La final de fază: `npm run build` fără erori, serverul local pornit, rezumat scurt.
- Nu inventa texte. Ce lipsește devine placeholder vizibil `[TEXT]`.
- Textele funcționale (aria-label, validare, erori) stau în blocul `ui` din `content/site.ts`, marcate „DE VERIFICAT".

## Reguli de arhitectură (SPEC §2)

1. **Tot textul** stă în `content/site.ts` (română) și `content/en.ts` (engleză). Nicio componentă nu are text hardcodat.
2. **Toate valorile vizuale** sunt tokens în `app/globals.css`, în `@theme`. Componentele folosesc doar clasele generate (`bg-background`, `text-accent`, `rounded-card`, `duration-fade`…), niciodată hex sau rgba direct.
3. **Numele brandului** e `brand.name` din `content/site.ts`, folosit peste tot.
4. **Logo-ul** e `components/brand/Logo.tsx` (SVG inline). Formele sunt în `components/brand/logo-shapes.ts`, folosite și de iconița iOS și imaginea OG; `app/icon.svg` are simbolul copiat.
5. **Placeholder-ele** folosesc componenta `Placeholder`, iar obiectele lor din `content/site.ts` au `placeholder: true`.
6. O componentă per secțiune în `components/sections/`, primitivele în `components/ui/`.
7. `README.md` explică unde e textul, tokens, logo-ul, placeholder-ele și variabilele de mediu.

## Note tehnice

- Două limbi: română la `/` (rewrite spre `app/[lang]` din `next.config.ts`), engleză la `/en`. Componentele de server iau textul cu `await getContent()` din `@/content` (limba vine din `next/root-params`); route handlers folosesc `contentFor(locale)` din `content/locales.ts`. Un text nou se adaugă în ambele fișiere. Paginile legale sunt doar în română (`notFound()` pe `/en/...`).
- Componentele client (`"use client"`) nu importă `content/site.ts`: primesc textul prin props de la o componentă server. Așa conținutul și iconițele nu ajung în JavaScript-ul trimis în browser.
- Linkurile către secțiuni se scriu ca `"#id"` și trec prin `SmartLink` / `Button`: pe prima pagină fac scroll cu Lenis, de pe alte pagini navighează la `/#id` (sau `/en#id` în engleză).
- Offset-ul pentru header se aplică în `lib/scroll.ts`. Nu pune `scroll-margin-top` (`scroll-mt-*`) pe secțiuni: Lenis îl adună la offset și secțiunea ajunge prea jos.
- Secțiunile folosesc `Section` (spațiere + Container). Cardurile din grid-uri stau în `FadeIn` cu `delay={stagger(index)}` din `lib/stagger.ts` (0, 80, 160, 240 ms).
- Imaginile trec prin `Media`: `next/image` când câmpul din content are `{ src, alt }`, altfel `Placeholder`.
- Textele cu `**bold**` din content se afișează cu `RichText`.
- Rândurile cu derulare orizontală (proiecte, testimoniale) folosesc `Carousel`: pagini, bulinele și săgețile de navigare, glisare nativă pe mobil. Tot rândul stă într-un singur `FadeIn`.
- Formularul: schema în `lib/lead.ts` (cu `zod/mini`, ca să rămână mic în browser), interfața în `LeadForm.tsx`, trimiterea în `app/api/lead/route.ts`. Mesajele și opțiunile se dau schemei prin parametri, din `content/site.ts`.
- Paginile legale: textul e în `content/site.ts` (`legal`), randat de `LegalDocument`; fiecare `page.tsx` are sus comentariul `{/* DE VERIFICAT înainte de lansare */}`.
- SEO: `lib/seo.ts` (`rootMetadata`, `pageMetadata`, `siteUrl`). O pagină nouă își ia metadata cu `pageMetadata(...)`, care include explicit imaginea OG.
- CSS care trebuie să bată o utilitate Tailwind (ex. pauza marquee-ului peste `animate-marquee`) stă în afara `@layer`.
- CTA-ul plutitor apare după ce marcajul `data-floating-cta-trigger` de sub butoanele din hero trece de header.
- `cn()` doar concatenează clase (fără tailwind-merge). Un `className` care contrazice o clasă de bază a componentei (ex. `hidden` peste `inline-flex` din Button) nu câștigă sigur: pune vizibilitatea / display-ul pe un element părinte.
- Fără GSAP sau Framer Motion. Animațiile sunt din CSS + IntersectionObserver (`FadeIn`, `LogoLoop`).
