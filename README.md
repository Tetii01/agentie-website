# Site [NUME AGENȚIE]

Site one-page pentru agenție, plus 3 pagini legale. Next.js 16 (App Router), TypeScript, Tailwind CSS v4.
Spec-ul complet e în [`docs/SPEC.md`](docs/SPEC.md).

## Pornire

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producție
```

## Unde e fiecare lucru

| Ce | Unde |
| --- | --- |
| Tot textul site-ului | `content/site.ts` |
| Culori, font, raze de colț, umbre, durate, spațieri | `app/globals.css`, blocul `@theme` |
| Logo | `components/brand/Logo.tsx` |
| Secțiunile paginii | `components/sections/` |
| Componente reutilizabile (Button, Card, Tag, FadeIn…) | `components/ui/` |

## Textul

Tot textul e în `content/site.ts`, grupat pe secțiuni (`hero`, `services`, `projects`…). Numele agenției e `brand.name` și apare automat în header, footer și metadata.

- `[TEXT]` înseamnă text care lipsește și trebuie completat.
- `**cuvinte**` marchează partea îngroșată sau evidențiată dintr-o frază.
- Blocul `ui` de la finalul fișierului conține texte funcționale (aria-label, mesaje de eroare), marcate „DE VERIFICAT".

## Culori, font, forme (tokens)

Toate valorile vizuale sunt tokens în `app/globals.css`, în blocul `@theme`. Componentele folosesc doar clasele generate din ele: `--color-accent` devine `bg-accent` și `text-accent`, `--radius-card` devine `rounded-card` și așa mai departe. Schimbi valoarea tokenului și se schimbă peste tot.

- **Culoarea de accent:** `--color-accent` (și `--color-accent-foreground` pentru textul de pe butoane). Glow-ul butonului se calculează automat din accent.
- **Fontul:** Geist se încarcă în `app/layout.tsx` prin `next/font`. Pentru alt font, schimbi importul de acolo; `--font-sans` din `globals.css` îl preia.
- **Tipografia:** `--text-h1`, `--text-h2`, `--text-lead` (plus variantele `-mobile`), fiecare cu line-height și letter-spacing proprii.

## Logo-ul

`components/brand/Logo.tsx` afișează acum numele ca text. Pentru logo-ul final, înlocuiești `<span>` cu SVG-ul (inline sau prin `next/image`) și păstrezi `aria-label={brand.name}` pe el. Componenta e folosită peste tot, deci se schimbă într-un singur loc.

## Placeholder-e → conținut real

Tot conținutul provizoriu are `placeholder: true` în `content/site.ts`. Caută după textul ăsta ca să le găsești pe toate. Pentru fiecare:

1. Completezi textele (`title`, `description`, `name`…).
2. Pentru imagini, pui fișierul în `public/` (ex. `public/proiecte/site-x.jpg`) și setezi câmpul de imagine (`image`, `avatar` sau `photo`) la `{ src: "/proiecte/site-x.jpg", alt: "Descriere scurtă" }`. Cât timp câmpul e `null`, se afișează blocul `Placeholder`.
3. Ștergi `placeholder: true`.

## Formularul de analiză

- Interfața: `components/sections/LeadForm.tsx`. Textele sunt în `content/site.ts` (`offer.form`, plus `ui.form` pentru erori).
- Validarea: `lib/lead.ts`, aceeași schemă în browser și pe server.
- Trimiterea: `app/api/lead/route.ts`. Trimite email prin Resend și, opțional, un POST JSON către un webhook (n8n, CRM).
- Anti-spam: un câmp capcană invizibil, plus respingerea trimiterilor făcute în mai puțin de 3 secunde de la încărcarea paginii.

## Variabile de mediu

Copiezi `.env.example` în `.env.local` și completezi valorile. Pe Vercel le setezi în Project → Settings → Environment Variables.

| Variabilă | Ce e |
| --- | --- |
| `RESEND_API_KEY` | Cheia API Resend, pentru trimiterea emailului |
| `LEAD_TO_EMAIL` | Adresa care primește lead-urile (mai multe: separate prin virgulă) |
| `LEAD_FROM_EMAIL` | Adresa expeditorului, de pe un domeniu verificat în Resend (ex. `Site <lead@domeniu.ro>`) |
| `LEAD_WEBHOOK_URL` | Opțional: webhook care primește lead-ul ca JSON |

Fără variabile, formularul nu crapă:

- **În development** (`npm run dev`): în terminal apar emailul și JSON-ul care s-ar fi trimis, iar formularul afișează mesajul de succes.
- **În producție:** dacă lead-ul nu ajunge nicăieri (nici email, nici webhook), formularul afișează mesajul de eroare cu linkul de WhatsApp, iar în logurile Vercel apare ce variabilă lipsește. Dacă emailul pleacă, o eroare a webhook-ului nu blochează mesajul de succes.
