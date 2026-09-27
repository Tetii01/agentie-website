# SPEC: site-ul agenției (bază gata pentru design)

Acesta e documentul de referință al proiectului. Lucrăm pe faze (vezi secțiunea 8): la fiecare mesaj primești ce fază să faci, faci doar faza aceea și te oprești.

Construiește site-ul de prezentare al agenției noastre de implementare AI pentru firme din România. Site-ul e o singură pagină (one-page) plus 3 pagini legale. Tot textul e în română.

Numele agenției, logo-ul și designul final NU sunt stabilite încă. Partenerul meu, David, se ocupă de branding și de design și va lucra peste codul tău. Deci treaba ta e să construiești o bază curată, completă și funcțională, cu un design de pornire dark, minimalist și aerisit, construit în așa fel încât David să poată schimba culorile, fonturile, logo-ul și vizualurile dintr-un singur loc, fără să rescrie componente.

## 1. Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- `lenis` pentru smooth scroll
- Font de pornire: Geist (prin `next/font`)
- Iconițe: `lucide-react`. Logo-uri de tool-uri: `simple-icons` (SVG)
- Formular: route handler Next.js + `zod` pentru validare + Resend pentru email
- Analytics: `@vercel/analytics` (fără cookie-uri, deci nu avem nevoie de banner de cookies)
- Deploy: Vercel
- Fără librării de animație grele (fără GSAP, fără Framer Motion). Animațiile se fac cu CSS + IntersectionObserver, ca mai jos.

## 2. Reguli de arhitectură (importante pentru colaborarea cu David)

1. **Tot textul stă într-un singur fișier**: `content/site.ts`. Nicio componentă nu are text hardcodat. Exportă obiecte tipizate (hero, problems, services, projects, testimonials, stats, offer, about, contact, footer, nav, floatingCta).
2. **Toate valorile vizuale sunt tokens** în `app/globals.css`, în blocul `@theme` din Tailwind v4: culori, font, raze de colț, umbre, durate de animație. Componentele folosesc doar tokens (`bg-background`, `text-accent`, `rounded-card` etc.), niciodată valori hex direct.
3. **Numele brandului** e o singură constantă în `content/site.ts` (`brand.name = "[NUME AGENȚIE]"`), folosită peste tot (header, footer, metadata, OG).
4. **Logo-ul** e o componentă separată `components/brand/Logo.tsx` care acum afișează numele în text. David o va înlocui cu SVG-ul lui.
5. **Placeholder-ele** (proiecte, testimoniale, cifre, poze) folosesc o componentă `Placeholder` care arată decent (bloc cu gradient neutru, colț rotunjit, o etichetă mică de tip „Imagine proiect"), ca site-ul să poată fi arătat și înainte să avem conținutul real. Fiecare obiect placeholder din `content/site.ts` are câmpul `placeholder: true`, ca să le găsim ușor.
6. O componentă per secțiune în `components/sections/`, primitivele reutilizabile în `components/ui/` (Button, Card, Tag, SectionHeading, FadeIn, LogoLoop, Placeholder, Container).
7. Scrie un `README.md` scurt care explică: unde e textul, unde sunt tokens, cum se înlocuiește logo-ul, cum se înlocuiește un placeholder cu conținut real, ce variabile de mediu trebuie setate.

## 3. Direcția vizuală de pornire

Referința de stil e un site de portofoliu premium, dark, foarte aerisit: mult spațiu între secțiuni, puțin text, titluri mari și strânse, carduri mari cu colțuri foarte rotunjite, un singur accent de culoare folosit rar. Nu copia branding-ul nimănui, construiește doar senzația asta.

Tokens de pornire (David le va schimba):

```
--color-background: #0d0d0d
--color-surface: #141414          (carduri)
--color-surface-2: #1a1a1a
--color-border: rgba(255,255,255,0.10)
--color-foreground: #ffffff
--color-muted: #909099            (text secundar)
--color-accent: #8b9cff           (accent PROVIZORIU, va fi înlocuit de brand)
--color-accent-foreground: #0d0d0d
--radius-card: 34px
--radius-pill: 9999px
--font-sans: Geist
```

Tipografie:
- H1: 80px pe desktop / 42px pe mobil, `font-bold`, `leading-[1.01]`, `tracking-[-0.3rem]` desktop / `tracking-[-2.4px]` mobil, centrat. Un cuvânt sau o sintagmă din titlu e evidențiat cu `text-accent` (în content, marchează partea evidențiată cu un câmp separat `highlight`).
- Subtitlu hero: 33px desktop / 20px mobil, `font-medium`, `text-muted`, max ~700px lățime.
- H2 secțiuni: ~56px desktop / 34px mobil, bold, tracking strâns.
- Text normal: 16–18px, `text-muted`.

Elemente de stil:
- Butoane tip pilulă. Butonul principal are fundal accent și, la hover, un glow subtil în culoarea accentului (`box-shadow` cu accentul).
- Carduri: `bg-surface`, border `border` de 1px, `rounded-card`, padding generos, gradient foarte subtil de sus în jos.
- Tag-uri mici tip pilulă pentru categorii.
- Un glow radial moale (gradient radial alb foarte transparent) în spatele vizualului din hero.
- Spațiere verticală mare între secțiuni (~160px desktop, ~96px mobil). Container max ~1200px, gutter 16px pe mobil.

## 4. Scroll și animații (vibe-ul e esențial, respectă exact valorile)

1. **Smooth scroll cu Lenis**, inițializat într-o componentă client `SmoothScroll` montată în `layout.tsx`:
   `new Lenis({ autoRaf: true, duration: 0.6 })`. Import dinamic, distrus la unmount. Linkurile ancoră din meniu și din butoane folosesc `lenis.scrollTo(target, { offset: -headerHeight })`. Adaugă CSS-ul recomandat de Lenis (`html.lenis`, `.lenis-smooth` etc.). Elementele cu scroll intern primesc `data-lenis-prevent`.
2. **Fade-in la scroll**: componentă `FadeIn` care pune clasa `fade-in-section` pe copil și un IntersectionObserver cu `threshold: 0.1` care face **toggle** la clasa `is-visible` (se adaugă când intră în ecran și se scoate când iese, deci elementele reapar animat și la scroll în sus).
   ```css
   .fade-in-section { opacity: 0; transform: translateY(20px); will-change: opacity, transform;
     transition: opacity .8s ease-in-out, transform .8s ease-in-out; }
   .fade-in-section.is-visible { opacity: 1; transform: translateY(0); }
   ```
   Suportă un prop `delay` (ms, prin `transition-delay`) ca să putem face stagger pe carduri (0, 80, 160, 240 ms). Aproape fiecare bloc din pagină (titlu, subtitlu, buton, fiecare card) e învelit în `FadeIn`.
3. **Logo loop**: bandă orizontală infinită (marquee) cu `translate3d`, viteză lentă și constantă, pauză la hover, fade pe margini cu `mask-image` gradient. Conținutul se dublează ca bucla să fie continuă.
4. **Header fix, tip sticlă**: `fixed top-0`, fundal `rgba(13,13,14,0.5)`, `backdrop-blur-[50px]`, border jos `rgba(198,198,198,0.15)`, tranziție 300ms.
5. **CTA plutitor jos**: o pilulă fixată jos pe centru (`bottom-[4%]`, pe mobil `bottom-[2%]` și lățime `calc(100%-24px)`), cu border în accent și fundal accent la ~10% opacitate + blur. Are 2 rânduri de text și o iconiță de săgeată într-un cerc accent. La click face scroll lin la formularul de analiză. Se ascunde când formularul e deja vizibil pe ecran.
6. `prefers-reduced-motion`: fără Lenis, fără fade-in (elemente vizibile direct), marquee oprit.

## 5. Structura paginii (în ordinea asta)

### 5.1 Header
Logo (stânga) · meniu: Servicii, Proiecte, Despre (ancore) · buton „Analiză gratuită" (dreapta, scroll la formular). Pe mobil: logo + buton compact cu iconiță, meniul se ascunde.

### 5.2 Hero
- Titlu: „Mai mulți clienți, mai puțină muncă." + highlight: „Cu AI."
- Subtitlu: „Implementăm chatboți, automatizări și conținut generat cu AI, construite pe procesele firmei tale. Tu te ocupi de clienți, restul merge singur."
- Buton principal: „Vreau analiza gratuită" (scroll la formular). Link secundar discret: „Vezi ce construim" (scroll la servicii).
- Vizual: `Placeholder` rotund/pătrat mare cu glow radial în spate (acolo vom pune poza noastră sau un vizual de brand).

### 5.3 Logo loop cu tool-urile integrate
- Etichetă mică deasupra: „Conectăm AI-ul la ce folosești deja"
- Logo-uri monocrome (alb la ~60% opacitate, 100% la hover) din `simple-icons`: WhatsApp, Instagram, Facebook, TikTok, Google, Gmail, Google Calendar, Google Sheets, OpenAI, Claude (Anthropic), Notion, Shopify, WordPress, Stripe.

### 5.4 Probleme (id `probleme`)
- H2: „Sună cunoscut?"
- 4 carduri în grid (2x2 desktop, 1 coloană mobil), fiecare cu iconiță lucide, titlu și o frază:
  1. „Răspunzi prea târziu la mesaje" · „Un client care îți scrie seara și primește răspuns a doua zi a cumpărat deja de la altcineva."
  2. „Nu ai timp de conținut" · „Știi că trebuie să postezi constant, dar între clienți și operațional, social media rămâne mereu pe mâine."
  3. „Pierzi ore pe aceleași task-uri" · „Copiezi date, trimiți aceleași mesaje, faci aceleași rapoarte. Muncă repetitivă care ar putea merge singură."
  4. „Informațiile sunt peste tot" · „Clienți în WhatsApp, oferte în Excel, notițe pe hârtie. Nimic nu comunică și mereu scapă ceva."
- Rând de încheiere, centrat, mai mare: „Toate au rezolvare. Și nu înseamnă să mai angajezi un om."

### 5.5 Servicii (id `servicii`)
- H2: „Ce construim"
- Subtitlu: „Fiecare firmă funcționează diferit. De aceea nu vindem pachete standard: pornim de la ce te blochează pe tine și construim exact ce-ți trebuie."
- 4 carduri mari (grid 2x2 desktop), fiecare cu titlu, descriere și 3–4 tag-uri:
  1. **Lead-uri și conversații** · „Chatbot pe site și pe WhatsApp care răspunde instant, zi și noapte, califică clienții și ți-i trimite gata de închis." · Tag-uri: Chatbot site, WhatsApp, Captare lead-uri, Programări
  2. **Conținut pe pilot automat** · „AI-ul analizează ce funcționează în nișa ta și îți trimite scripturi. Tu filmezi, noi edităm și postăm la orele potrivite." · Tag-uri: Research, Scripturi, Editare video, Postare automată
  3. **Aplicații și automatizări la comandă** · „CRM-uri, aplicații interne și integrări între tool-urile pe care le folosești deja, construite în jurul felului tău de lucru." · Tag-uri: CRM, Aplicații interne, Integrări, Rapoarte
  4. **Website-uri** · „Site-uri rapide și curate, gândite să transforme vizitatorii în clienți, cu AI integrat de la început." · Tag-uri: Prezentare, Landing page, Chatbot integrat, SEO
- Sub carduri, un card lat (full width), mai discret: „Ai altă idee? Dacă se poate automatiza, o construim." + buton „Hai să vorbim" (scroll la formular).

### 5.6 Proiecte (id `proiecte`)
- H2: „Proiecte"
- Grid de carduri ca un portofoliu (3 coloane desktop, 2 tabletă, 1 mobil). Fiecare card: imagine/mockup mare sus (Placeholder deocamdată, cu hover zoom ușor pe imagine 300ms `cubic-bezier(0.4,0,0.2,1)`), tag categorie, titlu, descriere scurtă, domeniu cu link extern.
- 6 carduri placeholder în `content/site.ts` (`placeholder: true`), cu câmpuri: `title`, `category`, `description`, `url`, `image`. Exemple de categorii de pus în placeholder: „Website", „Chatbot WhatsApp", „Aplicație internă", „Conținut automat", „UI/UX Design", „Website".

### 5.7 Testimoniale / colaborări
- Fără titlu mare, doar o etichetă mică: „Au lucrat cu noi".
- Rând de carduri (scroll orizontal pe mobil cu `data-lenis-prevent` dacă e nevoie, grid pe desktop). Fiecare card: avatar rotund, nume, rol, număr de urmăritori (opțional, text mic în accent), citat cu o parte îngroșată, link către profil/site.
- 4 carduri placeholder.

### 5.8 Cifre (bento)
- Grid bento cu 4 carduri (unul poate fi mai lat), fiecare: iconiță mică, etichetă mică în accent deasupra, valoare mare bold, text sub. Toate placeholder:
  - „[X]+" · „Proiecte livrate"
  - „[X] mil.+" · „Vizualizări pe proiectele lucrate"
  - „[X] ore" · „Timp de răspuns"
  - „[X] zile" · „Până la prima implementare"
- Valorile numerice fac count-up o singură dată când intră în ecran (dacă valoarea e numerică; dacă e placeholder text, se afișează direct).

### 5.9 Analiză gratuită + formular (id `analiza`)
Card mare, centrat, cu:
- Etichetă mică: „Primul pas"
- H2: „Analiză gratuită" + subtitlu: „Află unde pierde firma ta timp și clienți. Într-o discuție de 20 de minute îți arătăm concret ce se poate automatiza și ce impact ar avea."
- Listă cu bife (iconiță check în accent), afișată ca rând orizontal care se derulează lent (marquee) pe mobil și ca listă pe desktop:
  - „Pe firma ta, nu teorie generală"
  - „Vezi exact unde pierzi timp și clienți"
  - „Primești idei concrete, gata de aplicat"
  - „Tu alegi pe ce ne concentrăm"
  - „Fără obligații"
- **Formular în 2 pași**, în același card, cu tranziție fade/slide între pași:
  - Pasul 1: „Spune-ne despre firmă" · câmpuri: Numele firmei, Website sau pagină de social media (opțional), „Ce te interesează?" (butoane-chip selectabile, multi-select: Lead-uri și conversații, Conținut automat, Aplicație sau automatizare la comandă, Website, Nu știu încă). Buton „Continuă".
  - Pasul 2: „Încă câteva detalii" · Nume, Email, Telefon (prefix +40 afișat fix), Mesaj scurt (opțional). Checkbox obligatoriu: „Sunt de acord cu prelucrarea datelor conform [Politicii de confidențialitate]". Buton „Trimite cererea".
  - Sub buton: iconiță ceas + „Durează 10 secunde."
  - Stări: loading pe buton, mesaj de succes în card („Mulțumim! Te contactăm în cel mult [X] ore."), mesaj de eroare cu opțiunea de a scrie pe WhatsApp.
  - Anti-spam: câmp honeypot ascuns + respinge trimiterile făcute în mai puțin de 3 secunde de la încărcare.
- Sub card: „sau" + telefon și email ca linkuri (`tel:` și `mailto:`).

Backend formular: `app/api/lead/route.ts`
- Validare cu `zod` (aceeași schemă și pe client).
- Trimite email cu Resend către `LEAD_TO_EMAIL`, subiect „Lead nou: [firmă]", cu toate câmpurile formatate lizibil.
- Dacă există `LEAD_WEBHOOK_URL`, face și un POST JSON acolo (îl vom lega mai târziu de n8n / CRM). Eșecul webhook-ului nu blochează răspunsul de succes.
- Variabile de mediu: `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`, `LEAD_WEBHOOK_URL` (opțional). Creează `.env.example`.

### 5.10 CTA final
- Logo mare, centrat, + H2: „Ai un proiect?" + buton „Hai să vorbim" (scroll la formular) + buton secundar WhatsApp (`https://wa.me/[NUMĂR]` cu mesaj precompletat „Salut! Aș vrea să aflu mai multe despre implementarea AI în firma mea.").

### 5.11 Despre (id `despre`)
- Contur mare decorativ al logo-ului/numelui în fundal (outline, foarte transparent).
- H2: „Cine suntem"
- 2 carduri de fondatori, placeholder: poză (Placeholder), nume, rol, 2–3 roluri scurte bold (ex. „**Implementare** AI", „**Automatizări**" / „**Brand** Designer", „**UI/UX** Designer").
  - Teti · „Tehnic și implementare"
  - David · „Design și brand"
- Un paragraf scurt, text mare, cu câteva cuvinte evidențiate: „Construim soluții AI care chiar sunt folosite. Credem că **tehnologia bună** începe cu **înțelegerea afacerii**, comunicare deschisă și rezultate pe care le vezi în prima lună." (placeholder, îl rescriem noi)

### 5.12 Footer
- Stânga: logo + „© [NUME AGENȚIE]. Toate drepturile rezervate [anul curent automat]."
- Linkuri: Politica de confidențialitate, Politica de cookies, Termeni și condiții.
- Linkuri ANPC obligatorii: „ANPC" (https://anpc.ro/) și „ANPC - SAL" (https://anpc.ro/ce-este-sal/), fiecare cu textul lor.
- Social: Instagram, TikTok (placeholder URL-uri).
- Date firmă, text mic: „[DENUMIRE FIRMĂ] S.R.L. · CUI [ ] · Nr. Reg. Com. [ ] · Sibiu, România" (placeholder).

### 5.13 CTA plutitor
Textul: rând 1 „Află unde pierzi timp și clienți." · rând 2 (în accent) „Primești o analiză gratuită." Comportament descris la punctul 4.5.

## 6. Pagini legale

Rute: `/politica-de-confidentialitate`, `/politica-de-cookies`, `/termeni-si-conditii`. Layout simplu, text lizibil (max ~720px), același header și footer. Scrie un draft complet conform GDPR pentru un site de prezentare cu formular de contact (ce date colectăm prin formular, scopul, temeiul legal, cât le păstrăm, Resend ca procesator de email, Vercel ca hosting, Vercel Analytics fără cookie-uri, drepturile persoanei vizate, contact). Pune datele firmei ca placeholder și adaugă sus un comentariu în cod: `{/* DE VERIFICAT înainte de lansare */}`.

## 7. SEO și tehnic

- `<html lang="ro">`, metadata completă în `layout.tsx` (title, description, OG, Twitter card) generate din `content/site.ts`.
- Imagine OG generată cu `next/og` (fundal dark, numele brandului, tagline).
- `sitemap.ts`, `robots.ts`, favicon placeholder.
- `next/image` pentru toate imaginile.
- Accesibilitate: contrast bun, focus vizibil pe butoane și linkuri, `aria-label` pe butoanele cu doar iconiță, formular cu label-uri reale.
- Performanță țintă: Lighthouse 90+ pe mobil la toate categoriile.

## 8. Cum lucrezi

Proiectul Next.js se creează direct în folderul rădăcină (cel care conține `docs/`), nu într-un subfolder. Acest fișier rămâne în `docs/SPEC.md`.

Fazele:

- **Faza 1, fundația**: setup proiect, tokens, `content/site.ts` complet, primitivele UI (`FadeIn`, `SmoothScroll`, `LogoLoop`, `Placeholder`, `Button`, `Card`, `Tag`, `SectionHeading`, `Container`), apoi Header, Hero, logo loop și CTA-ul plutitor. Creează și un `CLAUDE.md` scurt în rădăcină cu regulile din secțiunea 2 și trimitere la `docs/SPEC.md`. Inițializează git și fă primul commit.
- **Faza 2, conținutul**: Probleme, Servicii, Proiecte, Testimoniale, Cifre.
- **Faza 3, conversia**: Analiză gratuită (formular + `app/api/lead`), CTA final, Despre, Footer.
- **Faza 4, finisarea**: pagini legale, SEO, apoi verificarea completă de mai jos.

Reguli pentru fiecare fază:

1. Faci doar faza cerută, apoi te oprești și aștepți. Nu treci singur la faza următoare.
2. La final de fază: `npm run build` fără erori, serverul local pornit, și un rezumat scurt cu ce ai făcut și ce ar trebui să verific în browser.
3. Nu inventa texte noi în afară de cele din acest document și de paginile legale. Unde lipsește ceva, pune un placeholder vizibil de forma `[TEXT]`.
4. Verificarea completă din Faza 4: build fără erori sau warning-uri de tipuri, pagina verificată la 375px, 768px și 1440px lățime, scroll-ul, fade-in-ul în ambele direcții, marquee-ul, CTA-ul plutitor, ambii pași ai formularului (cu și fără variabilele de mediu setate, fără să crape). La final: listă cu placeholder-ele rămase de completat și variabilele de mediu de setat pe Vercel.
