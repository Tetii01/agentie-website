# Site Creos AI

Site one-page pentru agenție, plus 3 pagini legale. Next.js 16 (App Router), TypeScript, Tailwind CSS v4.
Spec-ul complet e în [`docs/SPEC.md`](docs/SPEC.md).

## Pornire

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producție
npm start       # pornește build-ul de producție
```

## Unde e fiecare lucru

| Ce | Unde |
| --- | --- |
| Tot textul site-ului, inclusiv paginile legale | `content/site.ts` (română), `content/en.ts` (engleză) |
| Culori, font, raze de colț, umbre, durate, spațieri | `app/globals.css`, blocul `@theme` |
| Logo | `components/brand/Logo.tsx` |
| Secțiunile paginii | `components/sections/` |
| Componente reutilizabile (Button, Card, Tag, FadeIn…) | `components/ui/` |
| Paginile (prima pagină și cele legale) | `app/[lang]/` |
| SEO: title, description, Open Graph, Twitter | `lib/seo.ts` |
| Imaginea de share (OG) | `app/opengraph-image.tsx` (generată automat) |
| Favicon și iconița iOS | `app/icon.svg`, `app/apple-icon.tsx` |
| Sitemap și robots | `app/sitemap.ts`, `app/robots.ts` |
| Formularul și trimiterea lead-urilor | `components/sections/LeadForm.tsx`, `lib/lead.ts`, `app/api/lead/route.ts` |

## Textul

Tot textul e în `content/site.ts`, grupat pe secțiuni (`hero`, `services`, `projects`…). Numele agenției e `brand.name` și apare automat în header, footer, metadata, imaginea de share și paginile legale. Datele firmei (denumire, CUI, adresă) sunt în `company` și apar în footer și în paginile legale.

- `[TEXT]` înseamnă text care lipsește și trebuie completat.
- `**cuvinte**` marchează partea îngroșată sau evidențiată dintr-o frază. `[text](adresă)` face un link.
- Blocul `ui` de la finalul fișierului conține texte funcționale (aria-label, mesaje de eroare), marcate „DE VERIFICAT".
- Blocul `legal` conține drafturile paginilor legale, marcate „DE VERIFICAT înainte de lansare".

## Versiunea în engleză

Site-ul are două limbi: română la `/`, engleză la `/en`. Butonul de limbă stă lângă butonul principal din hero (`components/ui/LanguageSwitch.tsx`, textul lui e `ui.languageSwitch`).

- Textele în engleză sunt în `content/en.ts`, cu aceeași structură ca în română. Ce nu depinde de limbă (numele brandului, imaginile, linkurile, iconițele, datele firmei) se ia din `content/site.ts`, deci se schimbă într-un singur loc. Când adaugi un text nou în română, TypeScript cere și varianta în engleză.
- Paginile stau în `app/[lang]/`. `next.config.ts` servește varianta în română fără prefix (`/`, nu `/ro`) și redirecționează `/ro` spre `/`.
- Componentele de server își iau textul cu `await getContent()` din `content/index.ts`, care alege limba după adresă.
- Paginile legale există doar în română. În engleză, linkurile din footer duc tot la ele, marcate „(RO)".
- Emailul cu lead-ul rămâne în română și are un rând cu limba site-ului din care a venit cererea.

## Culori, font, forme (tokens)

Toate valorile vizuale sunt tokens în `app/globals.css`, în blocul `@theme`. Componentele folosesc doar clasele generate din ele: `--color-accent` devine `bg-accent` și `text-accent`, `--radius-card` devine `rounded-card` și așa mai departe. Schimbi valoarea tokenului și se schimbă peste tot, inclusiv în imaginea de share și în iconița iOS, care citesc culorile din `globals.css` la build.

- **Culoarea de accent:** `--color-accent`, roșul Creos din brand kit (`#FF3B4E`), și `--color-accent-foreground` (negru) pentru textul și iconițele de pe roșu. Tot ce folosește accentul (simbolul din logo, cercul cu săgeată, textele evidențiate, inelul liquid metal, lichidul din hero, intro-ul) îl preia automat.
- **Fontul:** Geist se încarcă în `app/[lang]/layout.tsx` prin `next/font`. Pentru alt font, schimbi importul de acolo; `--font-sans` din `globals.css` îl preia. Imaginea de share folosește fișierele din `assets/fonts/`.
- **Tipografia:** `--text-h1`, `--text-h2`, `--text-lead`, `--text-stat` (plus variantele `-mobile`), fiecare cu line-height și letter-spacing proprii.

Excepții, care nu pot citi tokens: `app/icon.svg` (favicon) și `themeColor` din `app/[lang]/layout.tsx` au culorile scrise direct. Le schimbi manual odată cu brandul.

**Secțiunea „Despre" are culorile ei de text.** E componenta „Team Section" de pe 21st.dev, așezată într-un card standard al site-ului. Titlul are stilul celorlalte secțiuni; restul textelor și efectele de hover păstrează valorile din preview-ul lor pe dark, prin tokens-urile `--color-team-*` și `--radius-team-card` din `globals.css`, care diferă intenționat de restul site-ului. Nu se schimbă odată cu brandul.

## Logo-ul

Logo-ul Creos („bucla": un C greu care se întoarce într-o săgeată) vine din brand kit (`Desktop/Creos brand kit`, cu README-ul lui pentru culori și reguli). Formele sunt în `components/brand/logo-shapes.ts`, și le folosesc toate locurile de mai jos:
- logo-ul orizontal: simbolul (inelul și săgeata) și textul „creos";
- simbolul singur, pe 80×80;
- textul „creos" singur, pentru literele mari din hero.

Pentru un logo nou, înlocuiești formele de acolo (atributele `d` din SVG-urile kitului) și dimensiunile (`logoViewBox`, `symbolViewBox`, `wordmarkViewBox`).

- **Pe site:** `components/brand/Logo.tsx`, cu două componente. `Logo` e logo-ul întreg (header, footer, secțiunea „Despre", intro-ul). `Submark` e doar simbolul; îl folosea cardul CTA final (`components/sections/FinalCta.tsx`), care acum nu mai apare în pagină. Simbolul ia culoarea de accent (`--color-accent`), textul ia culoarea textului. Numele din `brand.name` rămâne textul accesibil.
- **Imaginea de share:** `app/opengraph-image.tsx`.
- **Iconița iOS:** `app/apple-icon.tsx`. Simbolul în accent, pe fundalul cardurilor (`--color-surface`), ca `app-icon-negru-rosu` din kit.
- **Favicon:** `app/icon.svg`, copiat din kit (`iconite/favicon.svg`): simbolul roșu, pe fundal transparent. Culorile sunt scrise direct, pentru că e un fișier static.

## Mișcarea și stilul „liquid metal"

**Intro** (`components/sections/Intro.tsx`), doar cu logo-ul, pe fundal închis:
- **Ce face:** la prima intrare pe site, simbolul apare în centru, iar săgeata face un tur complet peste inelul estompat și se fixează la locul ei (inelul se umple, simbolul pulsează scurt). Apoi simbolul se mută la stânga, literele „creos" urcă pe rând, iar logo-ul zboară exact pe logo-ul din header, cât panoul se ridică și apare site-ul. Durează ~2,6 secunde.
- **Formele:** inelul, săgeata și literele vin din `components/brand/logo-shapes.ts` (textul e salvat câte o formă pe literă, ca să poată urca separat).
- **Când apare:** o singură dată pe sesiune. Nu apare la prefers-reduced-motion, când adresa duce direct la o secțiune (`/#analiza`) și fără JavaScript.
- **Se poate sări:** orice scroll, atingere sau tastă îl închide imediat.
- **Cum e făcut:** mișcarea e din CSS (blocul „INTRO" din `app/globals.css`). Un script mic rulează înainte de prima afișare, decide dacă intro-ul apare, măsoară unde aterizează logo-ul și îl închide. Pentru a schimba durata, se modifică și `LANDED` / `DONE` din `Intro.tsx`.

**Hero** (`components/sections/Hero.tsx`). Animația e preluată din „Motion Footer" (21st.dev, Hossain Jahed) și întoarsă pentru partea de sus a paginii:
- **La încărcare:** titlul și butoanele urcă unul după altul. Jos urcă „creos" în litere uriașe, doar contur, cu un gradient care se stinge, tăiat de marginea de jos (nu trece pe sub titlu).
- **Fundalul:** o „membrană" de lichid luminos care se deformează încet, sus-dreapta pe desktop și sus pe telefon (`components/ui/LiquidShader.tsx`, shader-ul preluat din „liquid shader", 21st.dev, dhileepkumargm). E WebGL direct, fără three.js, la rezoluție redusă și 30 de cadre pe secundă. Se oprește când cortina acoperă hero-ul. La prefers-reduced-motion e un singur cadru nemișcat, iar fără WebGL rămâne o lumină din CSS (`liquid-fallback`). Culorile pornesc din `--color-accent`, deci urmează brandul (cât de închis e corpul și cât de tare strălucesc marginile: `DEEP_SHADE`, `GLOW_STRENGTH`, `GLOW_WHITE`, `INTENSITY` sus în fișier). Poziția și mărimea sunt în `resize()`.
- **Cortina:** hero-ul stă fixat (`sticky`, în `app/[lang]/page.tsx`), iar restul paginii urcă peste el, cu marginea de sus rotunjită (utilitatea `hero-curtain`). Cât e acoperit, hero-ul se micșorează și se estompează, iar literele coboară și dispar. Merge din CSS (scroll-driven animations, `hero-recede` și `hero-letters-sink`), fără JavaScript, deci e fluid și pe telefon. Browserele fără suport păstrează hero-ul static.
- **Momentele:** tokenul `--animate-letters-rise` și blocul „HERO LA SCROLL" din `app/globals.css`.

**Footer** (`components/sections/Footer.tsx`), după „Footer Section" (21st.dev, efferd), adaptat la site:
- **Aspect:** colțuri mari sus, o linie care strălucește pe margine și o lumină moale care cade din mijloc.
- **Conținut:** logo, © și datele firmei, apoi patru coloane: navigare, contact, legal, social. Titlurile coloanelor sunt în `footer.headings`.
- **Apariție:** fiecare bloc apare dintr-un blur, unul după altul (`FadeIn` cu `variant="blur"`).

**Liquid metal** (după „Liquid Metal Button", 21st.dev, johuniq), pe tot site-ul. Varianta e din CSS, fără WebGL, ca să rămână ușoară pe telefon:
- **Butoanele principale** (`Button` `primary` și `light`, CTA-ul plutitor): un interior închis cu un inel cromat care curge încet (utilitatea `liquid-metal`, gradientul `--gradient-metal`). Butoanele nu se mută și nu cresc la hover; doar metalul se aprinde puțin. La apăsare au un mic „arc" (`--ease-overshoot`).
- **Butoanele secundare și controalele** (săgeți, buline, limba): contur metalic static (`metal-border`, `--gradient-control-border`).
- **Cardurile și hero-ul:** muchii care prind lumina (`--gradient-card-border`).
- **Titlurile mari:** text metalic, alb care se stinge spre jos (`text-metal`).

## Placeholder-e → conținut real

Tot conținutul provizoriu are `placeholder: true` în `content/site.ts`. Caută după textul ăsta ca să le găsești pe toate. Pentru fiecare:

1. Completezi textele (`title`, `description`, `name`…).
2. Pentru imagini, pui fișierul în `public/` (ex. `public/proiecte/site-x.jpg`) și setezi câmpul de imagine (`image`, `avatar` sau `photo`) la `{ src: "/proiecte/site-x.jpg", alt: "Descriere scurtă" }`. Cât timp câmpul e `null`, se afișează blocul `Placeholder`; când e completat, se afișează imaginea prin `next/image`.
3. Ștergi `placeholder: true`.

## Ce a rămas de completat

Toate sunt în `content/site.ts`, dacă nu e indicat alt fișier.

**Brand și general**

**Hero**
- Fără imagine: fundalul e lichidul desenat de `LiquidShader` (vezi mai sus). Acțiunile care se schimbă în titlu: `hero.actions`.

**Proiecte** (6 carduri; primele patru sunt completate)
- Proiectele 5 și 6: `[TITLU PROIECT …]`, `[DESCRIERE SCURTĂ]`, `[URL PROIECT]`, `image`. Imaginile stau în `public/proiecte/`. Un `url` gol înseamnă fără buton spre site.
- Categoriile sunt cele date ca exemplu în spec. Le ajustezi după proiectele reale.

**Testimoniale** (5 carduri, completate)
- AT Transport: lipsesc poza (`avatar`, acum un cerc gol) și contul de Instagram (`handle` + `url`).
- Pozele celorlalți sunt pozele de profil publice de pe Instagram, de 100×100 px (`public/testimoniale/`). Dacă aveți variante mai mari, le înlocuiți cu același nume.
- Numărul de urmăritori (`followers`) e cel de pe Instagram la 1 octombrie 2026. Trebuie actualizat din când în când.

**Cifre** (4 carduri, completate)
- 25+ proiecte livrate, 50M+ vizualizări, răspuns în 2 ore, primul sistem în 7 zile. **De verificat înainte de lansare:** trebuie să fie reale. Le schimbați în `stats` (și în engleză, în `content/en.ts`). O valoare care începe cu un număr face automat count-up.

**Analiză gratuită și contact**
- Mesajul de succes: „Te contactăm în cel mult 2 ore". Trebuie să fie același cu timpul de răspuns din cifre.
- Telefon `[TELEFON]` și email `[EMAIL]`: `contact.phone` (text și `tel:`) și `contact.email` (text și `mailto:`).
- WhatsApp `[NUMĂR]`: format internațional, fără + și spații (ex. `40712345678`).

**Despre**
- Pozele fondatorilor: `photo`. Apar rotunde (136 px), decupate pătrat din centru, deci fața trebuie să fie în mijlocul pozei.
- Conturile de Instagram ale fondatorilor: `instagram` (`handle` + `url`), iconița de sub rol.
- Iconița de Instagram a firmei ia linkul din footer (`footer.social`). Cât linkul e placeholder, iconița apare fără link.
- Paragraful (`about.text`), pe care urmează să-l rescrieți.

**Footer și datele firmei**
- `company`: `[DENUMIRE FIRMĂ] S.R.L.`, `CUI [ ]`, `Nr. Reg. Com. [ ]`, `[ADRESA SEDIULUI]`.
- Instagram `[URL INSTAGRAM]`, TikTok `[URL TIKTOK]`.

**Pagini legale** (tot textul e DE VERIFICAT, ideal cu un avocat sau consultant GDPR)
- `[DATA]`: data ultimei actualizări, la toate cele 3 pagini.
- `[12 luni]`: cât păstrați datele din formular dacă nu începe o colaborare.
- `[alte instrumente folosite pentru gestionarea cererilor…]`: CRM-ul sau n8n, dacă îl legați la webhook. Altfel ștergi rândul.

**Texte funcționale**
- Blocul `ui` (aria-label, mesajele de validare, eroarea cu WhatsApp, emailul cu lead-ul), marcat DE VERIFICAT.

**Pe Vercel**
- Variabilele de mediu (vezi mai jos) și activarea Web Analytics.

## Formularul de analiză

- Interfața: `components/sections/LeadForm.tsx`. Textele sunt în `content/site.ts` (`offer.form`, plus `ui.form` pentru erori).
- Validarea: `lib/lead.ts`, aceeași schemă în browser și pe server.
- „Propune-ne tu ceva": opțiunea din `offer.form.step1.idea.option` deschide câmpul `idea` (ideea clientului), obligatoriu doar atunci. Ideea apare în email și în JSON-ul trimis la webhook.
- Trimiterea: `app/api/lead/route.ts`. Trimite email prin Resend, cu Reply-To pe adresa clientului, și, opțional, un POST JSON către un webhook (n8n, CRM).
- Anti-spam: un câmp capcană invizibil, plus respingerea trimiterilor făcute în mai puțin de 3 secunde de la încărcarea paginii.

## Variabile de mediu

Copiezi `.env.example` în `.env.local` și completezi valorile. Pe Vercel le setezi în Project → Settings → Environment Variables.

| Variabilă | Ce e |
| --- | --- |
| `RESEND_API_KEY` | Cheia API Resend, pentru trimiterea emailului |
| `LEAD_TO_EMAIL` | Adresa care primește lead-urile (mai multe: separate prin virgulă) |
| `LEAD_FROM_EMAIL` | Adresa expeditorului, de pe un domeniu verificat în Resend (ex. `Site <lead@domeniu.ro>`) |
| `LEAD_WEBHOOK_URL` | Opțional: webhook care primește lead-ul ca JSON |
| `NEXT_PUBLIC_SITE_URL` | Opțional: adresa publică (ex. `https://domeniu.ro`), pentru sitemap, robots și linkurile de share. Fără ea, pe Vercel se folosește automat domeniul de producție |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Indexarea în Google. Cât timp nu e `true`, `robots.txt` blochează tot (`Disallow: /`) și fiecare pagină are `noindex, nofollow`. Se setează `true` doar la lansare |

Fără variabile, formularul nu crapă:

- **În development** (`npm run dev`): în terminal apar emailul și JSON-ul care s-ar fi trimis, iar formularul afișează mesajul de succes.
- **În producție:** dacă lead-ul nu ajunge nicăieri (nici email, nici webhook), formularul afișează mesajul de eroare cu linkul de WhatsApp, iar în logurile Vercel apare ce variabilă lipsește. Dacă emailul pleacă, o eroare a webhook-ului nu blochează mesajul de succes.

## Deploy pe Vercel

1. **Pune codul pe GitHub.** Creezi un repository gol pe GitHub, apoi, din folderul proiectului:
   ```bash
   git remote add origin https://github.com/<cont>/<repo>.git
   git push -u origin main
   ```
2. **Importă proiectul.** Pe [vercel.com](https://vercel.com): Add New → Project → alegi repository-ul. Vercel recunoaște singur Next.js; lași setările de build implicite.
3. **Setează variabilele de mediu,** înainte de primul deploy, în secțiunea Environment Variables de pe aceeași pagină: `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL` și, dacă e cazul, `LEAD_WEBHOOK_URL` și `NEXT_PUBLIC_SITE_URL`. Bifează cel puțin mediul **Production**. Dacă vrei ca formularul să meargă și pe linkurile de preview, bifează și **Preview**.
4. **Deploy.** După build primești un link `*.vercel.app`.
5. **Domeniul.** Project → Settings → Domains → adaugi domeniul, apoi pui la furnizorul de DNS înregistrările afișate de Vercel (de regulă un `A` pentru domeniul principal și un `CNAME` pentru `www`). Setează apoi `NEXT_PUBLIC_SITE_URL=https://domeniu.ro` și refă deploy-ul.
6. **Statisticile.** Project → Analytics → Enable Web Analytics. Codul e deja inclus și se activează doar pe Vercel. Nu folosește cookie-uri, deci nu e nevoie de banner.
7. **Verificare.** Trimiți o dată formularul de pe site și verifici emailul. Dacă nu vine, te uiți în Project → Logs după mesajele care încep cu `[lead]`.

De reținut: o variabilă de mediu schimbată se aplică doar deploy-urilor noi. După orice modificare: Deployments → ultimul deploy → Redeploy.

## Preview pentru branch-ul `design`

Fiecare push pe `design` face automat, prin integrarea Git a Vercel, un deploy de preview la adresa fixă a branch-ului: **https://agentie-website-git-design-teti01.vercel.app**. Rezultatul fiecărui deploy apare în Vercel → proiectul `agentie-website` → Deployments.

Pe planul Hobby, Vercel blochează deploy-urile din commit-urile altor persoane decât proprietarul contului doar dacă repo-ul e **privat**. De aceea repo-ul e public temporar. Dacă redevine privat, deploy-urile lui David vor apărea din nou ca „Blocked”; soluția oficială atunci e planul Pro.

## Lansarea

Până la lansare, site-ul e online, dar nu apare în Google: `robots.txt` blochează tot, iar paginile au `noindex, nofollow`. În ziua lansării:

1. Completezi placeholder-ele rămase (vezi „Ce a rămas de completat") și verifici textele legale.
2. Pe Vercel, verifici variabilele pentru formular (`RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`) și `NEXT_PUBLIC_SITE_URL=https://domeniu.ro`.
3. Setezi `NEXT_PUBLIC_ALLOW_INDEXING=true` (doar pe mediul **Production**, ca linkurile de preview să rămână neindexate).
4. Redeploy. Verifici `https://domeniu.ro/robots.txt`: trebuie să apară `Allow: /` și linia `Sitemap:`. În sursa paginii nu mai trebuie să existe `noindex`.
5. Opțional: adaugi site-ul în [Google Search Console](https://search.google.com/search-console) și trimiți `https://domeniu.ro/sitemap.xml`.

## Resend: configurarea cu domeniul vostru

**Până aveți domeniu (doar pentru test).** Resend permite trimiterea de pe `onboarding@resend.dev`, dar numai către adresa contului Resend:
- `LEAD_FROM_EMAIL=onboarding@resend.dev`
- `LEAD_TO_EMAIL=` adresa cu care v-ați făcut contul Resend

**Când aveți domeniu:**
1. În [Resend](https://resend.com): Domains → Add Domain → scrii domeniul (ex. `domeniu.ro`) și alegi regiunea **EU (Ireland)**, ca datele să rămână în UE.
2. Resend afișează câteva înregistrări DNS: un `MX` și un `TXT` (SPF) pentru subdomeniul de trimitere, plus un `TXT` pentru DKIM (`resend._domainkey`). Le adaugi exact așa la furnizorul de DNS, acolo unde ai pus și înregistrările pentru Vercel.
3. Recomandat: adaugi și un `TXT` pentru DMARC, cu numele `_dmarc` și valoarea `v=DMARC1; p=none;`. Ajută la livrare.
4. În Resend apeși Verify. Verificarea durează de la câteva minute la câteva ore, până când domeniul apare ca **Verified**.
5. API Keys → Create API Key, cu permisiunea **Sending access** și restricționată la domeniul vostru. Copiezi cheia (se afișează o singură dată) în `RESEND_API_KEY` pe Vercel.
6. Setezi `LEAD_FROM_EMAIL`, de exemplu `Site Creos AI <lead@domeniu.ro>`. Adresa nu trebuie să existe ca inbox; trebuie doar să fie pe domeniul verificat. Setezi și `LEAD_TO_EMAIL`, inbox-ul unde vreți lead-urile.
7. Refaci deploy-ul și trimiți un test din formular. În Resend → Emails vezi fiecare email trimis și dacă a fost livrat.

Emailurile au Reply-To pe adresa clientului: un „Reply" din inbox îi răspunde direct lui.
