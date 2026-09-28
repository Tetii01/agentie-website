# Site [NUME AGENȚIE]

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
| Tot textul site-ului, inclusiv paginile legale | `content/site.ts` |
| Culori, font, raze de colț, umbre, durate, spațieri | `app/globals.css`, blocul `@theme` |
| Logo | `components/brand/Logo.tsx` |
| Secțiunile paginii | `components/sections/` |
| Componente reutilizabile (Button, Card, Tag, FadeIn…) | `components/ui/` |
| Paginile legale | `app/politica-de-confidentialitate/`, `app/politica-de-cookies/`, `app/termeni-si-conditii/` |
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

## Culori, font, forme (tokens)

Toate valorile vizuale sunt tokens în `app/globals.css`, în blocul `@theme`. Componentele folosesc doar clasele generate din ele: `--color-accent` devine `bg-accent` și `text-accent`, `--radius-card` devine `rounded-card` și așa mai departe. Schimbi valoarea tokenului și se schimbă peste tot, inclusiv în imaginea de share și în iconița iOS, care citesc culorile din `globals.css` la build.

- **Culoarea de accent:** `--color-accent` (și `--color-accent-foreground` pentru textul de pe butoane). Glow-ul butonului se calculează automat din accent.
- **Fontul:** Geist se încarcă în `app/layout.tsx` prin `next/font`. Pentru alt font, schimbi importul de acolo; `--font-sans` din `globals.css` îl preia. Imaginea de share folosește fișierele din `assets/fonts/`.
- **Tipografia:** `--text-h1`, `--text-h2`, `--text-lead`, `--text-stat` (plus variantele `-mobile`), fiecare cu line-height și letter-spacing proprii.

Excepții, care nu pot citi tokens: `app/icon.svg` (favicon) și `themeColor` din `app/layout.tsx` au culorile scrise direct. Le schimbi manual odată cu brandul.

## Logo-ul

`components/brand/Logo.tsx` afișează acum numele ca text. Pentru logo-ul final, înlocuiești `<span>` cu SVG-ul (inline sau prin `next/image`) și păstrezi `aria-label={brand.name}` pe el. Componenta e folosită peste tot, deci se schimbă într-un singur loc. Are trei mărimi (`md` în header și footer, `xl` în CTA-ul final, `display` pentru conturul din „Despre") și varianta `outline` (doar contur).

Favicon-ul (`app/icon.svg`) și iconița iOS (`app/apple-icon.tsx`) sunt forme provizorii: le înlocuiești cu logo-ul. Pentru iOS poți pune direct un fișier `app/apple-icon.png` de 180×180 și ștergi `apple-icon.tsx`.

## Placeholder-e → conținut real

Tot conținutul provizoriu are `placeholder: true` în `content/site.ts`. Caută după textul ăsta ca să le găsești pe toate. Pentru fiecare:

1. Completezi textele (`title`, `description`, `name`…).
2. Pentru imagini, pui fișierul în `public/` (ex. `public/proiecte/site-x.jpg`) și setezi câmpul de imagine (`image`, `avatar` sau `photo`) la `{ src: "/proiecte/site-x.jpg", alt: "Descriere scurtă" }`. Cât timp câmpul e `null`, se afișează blocul `Placeholder`; când e completat, se afișează imaginea prin `next/image`.
3. Ștergi `placeholder: true`.

## Ce a rămas de completat

Toate sunt în `content/site.ts`, dacă nu e indicat alt fișier.

**Brand și general**
- `brand.name`: `[NUME AGENȚIE]`. Apare peste tot, inclusiv în imaginea de share.
- Logo-ul: `components/brand/Logo.tsx` (acum e text).
- Favicon și iconița iOS: `app/icon.svg`, `app/apple-icon.tsx`.
- Culoarea de accent: `--color-accent` în `app/globals.css` e provizorie. Dacă o schimbi, actualizează și `app/icon.svg`.

**Hero**
- Vizualul: `hero.visual.image` (acum `null`, se afișează placeholder-ul).

**Proiecte** (6 carduri)
- `[TITLU PROIECT 1]` … `[TITLU PROIECT 6]`, `[DESCRIERE SCURTĂ]`, `[URL PROIECT]`, `image`.
- Categoriile sunt cele date ca exemplu în spec. Le ajustezi după proiectele reale.

**Testimoniale** (4 carduri)
- `[NUME]`, `[ROL]`, `[X] urmăritori` (opțional: poate fi șters), `[CITAT] **[PARTE ÎNGROȘATĂ]** [CITAT]`, `[URL PROFIL SAU SITE]`, `avatar`.

**Cifre** (4 carduri)
- Etichetele `[ETICHETĂ]` și valorile `[X]+`, `[X] mil.+`, `[X] ore`, `[X] zile`. O valoare care începe cu un număr (ex. `120+`) face automat count-up.

**Analiză gratuită și contact**
- Mesajul de succes: „Te contactăm în cel mult `[X]` ore".
- Telefon `[TELEFON]` și email `[EMAIL]`: `contact.phone` (text și `tel:`) și `contact.email` (text și `mailto:`).
- WhatsApp `[NUMĂR]`: format internațional, fără + și spații (ex. `40712345678`).

**Despre**
- Pozele fondatorilor: `photo`.
- Rolurile scurte (`highlights`): acum sunt exemplele din spec.
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

Pe planul Hobby, într-un repo privat, Vercel blochează deploy-urile automate pentru commit-urile altor persoane decât proprietarul contului. Pentru branch-ul `design` deploy-ul îl face un GitHub Action:

- `.github/workflows/preview-design.yml` rulează la fiecare push pe `design`: face build și un deploy de **preview** (niciodată producție) cu tokenul proprietarului, apoi mută adresa fixă **https://agentie-website-design.vercel.app** pe deploy-ul nou.
- `vercel.json` oprește deploy-urile automate ale integrării Git doar pentru `design`, ca să nu mai apară deploy-uri blocate. `main` se publică în continuare automat.
- Secretele din repo (GitHub → Settings → Secrets and variables → Actions): `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
- Rezultatul fiecărei rulări: tab-ul **Actions** din repo.
- Branch-ul `design` trebuie să conțină `vercel.json` și workflow-ul. Dacă e recreat din `main`, le are automat.

Tokenul Vercel expiră. Când expiră, workflow-ul eșuează la pasul „Setările proiectului". Generezi atunci unul nou (vercel.com → Account Settings → Tokens) și îl actualizezi cu `gh secret set VERCEL_TOKEN -R Tetii01/agentie-website`.

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
6. Setezi `LEAD_FROM_EMAIL`, de exemplu `Site [NUME AGENȚIE] <lead@domeniu.ro>`. Adresa nu trebuie să existe ca inbox; trebuie doar să fie pe domeniul verificat. Setezi și `LEAD_TO_EMAIL`, inbox-ul unde vreți lead-urile.
7. Refaci deploy-ul și trimiți un test din formular. În Resend → Emails vezi fiecare email trimis și dacă a fost livrat.

Emailurile au Reply-To pe adresa clientului: un „Reply" din inbox îi răspunde direct lui.
