/**
 * TOT TEXTUL SITE-ULUI
 *
 * Componentele nu au text hardcodat: tot ce apare pe pagină vine de aici.
 *
 * Convenții:
 * - `placeholder: true` → conținut provizoriu. Caută „placeholder: true" ca să le găsești pe toate.
 * - `[TEXT]`            → text care lipsește și trebuie completat înainte de lansare.
 * - `**cuvinte**`       → partea îngroșată / evidențiată dintr-o frază.
 * - Blocul `ui` de la final → texte funcționale (aria-label, validare, erori), DE VERIFICAT.
 */

import type { LucideIcon } from "lucide-react";
import {
  Clapperboard,
  Database,
  Eye,
  FolderCheck,
  Globe,
  MessageCircle,
  MessageCircleWarning,
  Plug,
  Repeat,
  Rocket,
  Shuffle,
  Timer,
  Workflow,
} from "lucide-react";
import type { SimpleIcon } from "simple-icons";
import {
  siClaude,
  siFacebook,
  siGmail,
  siGoogle,
  siGooglecalendar,
  siGooglegemini,
  siGooglesheets,
  siInstagram,
  siNotion,
  siShopify,
  siStripe,
  siTiktok,
  siWhatsapp,
  siWordpress,
} from "simple-icons";
import { routes } from "@/lib/routes";

/* ───────────────────────── Tipuri ───────────────────────── */

export type LinkItem = { label: string; href: string };

/** Imagine reală. `null` = se afișează componenta Placeholder. */
export type ImageRef = { src: string; alt: string } | null;

/* ───────────────────────── Brand și rute ───────────────────────── */

export const brand = {
  name: "[NUME AGENȚIE]",
};

/** Id-urile secțiunilor, folosite de meniu și de butoanele care fac scroll. */
export const anchors = {
  problems: "probleme",
  services: "servicii",
  projects: "proiecte",
  offer: "analiza",
  about: "despre",
} as const;

const toSection = (id: string) => `#${id}`;

/* ───────────────────────── Navigare ───────────────────────── */

export const nav = {
  links: [
    { label: "Servicii", href: toSection(anchors.services) },
    { label: "Proiecte", href: toSection(anchors.projects) },
    { label: "Despre", href: toSection(anchors.about) },
  ] satisfies LinkItem[],
  cta: { label: "Analiză gratuită", href: toSection(anchors.offer) } satisfies LinkItem,
};

/* ───────────────────────── 5.2 Hero ───────────────────────── */

export const hero = {
  /** Primul rând al titlului. */
  title: "Tu conduci firma.",
  /** Titlul complet din rândul 2: îl citesc cititoarele de ecran, Google și imaginea de share. */
  highlight: "AI-ul face restul.",
  /** Rândul 2 pe ecran: „AI-ul" + o acțiune care se schimbă singură (în accent). */
  subject: "AI-ul",
  /** Ultima rămâne pe ecran pentru cine are animațiile oprite. Scurte: încap pe un rând pe telefon. */
  actions: ["răspunde instant.", "aduce clienți.", "scrie conținutul.", "face rapoartele.", "face restul."],
  primaryCta: { label: "Cere analiza gratuită", href: toSection(anchors.offer) } satisfies LinkItem,
};

/** Titlul și descrierea paginii (tab-ul browserului, Google, share). */
export const seo = {
  title: `${brand.name} · ${hero.title} ${hero.highlight}`,
  description:
    "Implementăm chatboți, automatizări și conținut generat cu AI, construite pe procesele firmei tale. Tu te ocupi de clienți, restul merge singur.",
};

/* ───────────────────────── 5.3 Logo loop ───────────────────────── */

export type Tool = { name: string; icon: SimpleIcon };

export const tools = {
  label: "Conectăm AI-ul la ce folosești deja",
  items: [
    { name: "WhatsApp", icon: siWhatsapp },
    { name: "Instagram", icon: siInstagram },
    { name: "Facebook", icon: siFacebook },
    { name: "TikTok", icon: siTiktok },
    { name: "Google", icon: siGoogle },
    { name: "Gmail", icon: siGmail },
    { name: "Google Calendar", icon: siGooglecalendar },
    { name: "Google Sheets", icon: siGooglesheets },
    { name: "Google Gemini", icon: siGooglegemini },
    { name: "Claude", icon: siClaude },
    { name: "Notion", icon: siNotion },
    { name: "Shopify", icon: siShopify },
    { name: "WordPress", icon: siWordpress },
    { name: "Stripe", icon: siStripe },
  ] satisfies Tool[],
};

/* ───────────────────────── 5.4 Probleme ───────────────────────── */

export const problems = {
  /** Eticheta mică de deasupra secțiunii. */
  label: "Provocări",
  id: anchors.problems,
  title: "Sună cunoscut?",
  items: [
    {
      icon: MessageCircleWarning,
      title: "Răspunzi prea târziu la mesaje",
      text: "Un client care îți scrie seara și primește răspuns a doua zi a cumpărat deja de la altcineva.",
    },
    {
      icon: Clapperboard,
      title: "Nu ai timp de conținut",
      text: "Știi că trebuie să postezi constant, dar între clienți și operațional, social media rămâne mereu pe mâine.",
    },
    {
      icon: Repeat,
      title: "Pierzi ore pe aceleași task-uri",
      text: "Copiezi date, trimiți aceleași mesaje, faci aceleași rapoarte. Muncă repetitivă care ar putea merge singură.",
    },
    {
      icon: Shuffle,
      title: "Informațiile sunt peste tot",
      text: "Clienți în WhatsApp, oferte în Excel, notițe pe hârtie. Nimic nu comunică și mereu scapă ceva.",
    },
  ] satisfies { icon: LucideIcon; title: string; text: string }[],
  closing: "Toate au rezolvare. Și nu înseamnă să mai angajezi un om.",
};

/* ───────────────────────── Banda dintre probleme și servicii ───────────────────────── */

/** Ce construim, pe banda discretă care trece între „Sună cunoscut?" și „Ce construim" (iconiță + cuvânt). */
export const band = {
  items: [
    { label: "Chatboți", icon: MessageCircle },
    { label: "Automatizări", icon: Workflow },
    { label: "Conținut", icon: Clapperboard },
    { label: "CRM-uri", icon: Database },
    { label: "Integrări", icon: Plug },
    { label: "Website-uri", icon: Globe },
  ] satisfies { label: string; icon: LucideIcon }[],
};

/* ───────────────────────── 5.5 Servicii ───────────────────────── */

export const services = {
  /** Eticheta mică de deasupra secțiunii. */
  label: "Servicii",
  id: anchors.services,
  title: "Ce construim",
  subtitle:
    "Fiecare firmă funcționează diferit. De aceea nu vindem pachete standard: pornim de la ce te blochează pe tine și construim exact ce-ți trebuie.",
  items: [
    {
      title: "Lead-uri și conversații",
      description:
        "Chatbot pe site și pe WhatsApp care răspunde instant, zi și noapte, califică clienții și ți-i trimite gata de închis.",
      tags: ["Chatbot site", "WhatsApp", "Captare lead-uri", "Programări"],
    },
    {
      title: "Conținut pe pilot automat",
      description:
        "AI-ul analizează ce funcționează în nișa ta și îți trimite scripturi. Tu filmezi, noi edităm și postăm la orele potrivite.",
      tags: ["Research", "Scripturi", "Editare video", "Postare automată"],
    },
    {
      title: "Aplicații și automatizări la comandă",
      description:
        "CRM-uri, aplicații interne și integrări între tool-urile pe care le folosești deja, construite în jurul felului tău de lucru.",
      tags: ["CRM", "Aplicații interne", "Integrări", "Rapoarte"],
    },
    {
      title: "Website-uri",
      description:
        "Site-uri rapide și curate, gândite să transforme vizitatorii în clienți, cu AI integrat de la început.",
      tags: ["Prezentare", "Landing page", "Chatbot integrat", "SEO"],
    },
  ] satisfies { title: string; description: string; tags: string[] }[],
  /** Cardul lat de sub servicii. */
  custom: {
    title: "Ai altă idee?",
    text: "Dacă se poate automatiza, o construim.",
    cta: { label: "Hai să vorbim", href: toSection(anchors.offer) } satisfies LinkItem,
  },
};

/* ───────────────────────── 5.6 Proiecte ───────────────────────── */

export type Project = {
  placeholder?: boolean;
  title: string;
  category: string;
  description: string;
  url: string;
  image: ImageRef;
  /** Cardurile din fereastra de detalii (se deschide la click pe proiect). Scurte: 3–4 carduri, câte o frază. */
  details: { title: string; text: string }[];
};

const projectDetailsPlaceholder = [
  { title: "[TITLU]", text: "[TEXT]" },
  { title: "[TITLU]", text: "[TEXT]" },
  { title: "[TITLU]", text: "[TEXT]" },
];

export const projects = {
  id: anchors.projects,
  title: "Proiecte",
  imagePlaceholderLabel: "Imagine proiect",
  items: [
    {
      title: "X Sweets and Coffee",
      category: "Website + chatboți AI",
      description: "Site nou pentru cafenea, cu chatboți AI integrați care răspund clienților pe loc.",
      url: "https://xsweetsandcoffee.ro",
      image: { src: "/proiecte/x-sweets-and-coffee.jpg", alt: "Site-ul X Sweets and Coffee pe un laptop" },
      details: [
        { title: "Clientul", text: "Cafenea și cofetărie din Păltiniș, Sibiu." },
        { title: "Website", text: "Site de prezentare cu meniu, galerie și rezervări." },
        { title: "Chatboți AI", text: "Chatboți integrați care răspund pe loc la întrebările clienților." },
        { title: "Rezultat", text: "[REZULTAT]" },
      ],
    },
    {
      placeholder: true,
      title: "[TITLU PROIECT 2]",
      category: "Chatbot WhatsApp",
      description: "[DESCRIERE SCURTĂ]",
      url: "[URL PROIECT]",
      image: null,
      details: projectDetailsPlaceholder,
    },
    {
      placeholder: true,
      title: "[TITLU PROIECT 3]",
      category: "Aplicație internă",
      description: "[DESCRIERE SCURTĂ]",
      url: "[URL PROIECT]",
      image: null,
      details: projectDetailsPlaceholder,
    },
    {
      placeholder: true,
      title: "[TITLU PROIECT 4]",
      category: "Conținut automat",
      description: "[DESCRIERE SCURTĂ]",
      url: "[URL PROIECT]",
      image: null,
      details: projectDetailsPlaceholder,
    },
    {
      placeholder: true,
      title: "[TITLU PROIECT 5]",
      category: "UI/UX Design",
      description: "[DESCRIERE SCURTĂ]",
      url: "[URL PROIECT]",
      image: null,
      details: projectDetailsPlaceholder,
    },
    {
      placeholder: true,
      title: "[TITLU PROIECT 6]",
      category: "Website",
      description: "[DESCRIERE SCURTĂ]",
      url: "[URL PROIECT]",
      image: null,
      details: projectDetailsPlaceholder,
    },
  ] satisfies Project[],
};

/* ───────────────────────── 5.7 Testimoniale ───────────────────────── */

export type Testimonial = {
  placeholder?: boolean;
  name: string;
  role: string;
  /** Opțional: număr de urmăritori, afișat mic, în accent. */
  followers?: string;
  /** Bifa de lângă nume: doar dacă persoana are cont verificat. */
  verified?: boolean;
  /** Partea dintre ** ** apare îngroșată. */
  quote: string;
  /** Opțional: contul de social media, afișat jos, în accent (ex. „@nume"). */
  handle?: string;
  url: string;
  avatar: ImageRef;
};

const testimonialPlaceholder: Testimonial = {
  placeholder: true,
  name: "[NUME]",
  role: "[ROL]",
  followers: "[X] urmăritori",
  verified: true,
  quote: "[CITAT] **[PARTE ÎNGROȘATĂ]** [CITAT]",
  handle: "[@CONT]",
  url: "[URL PROFIL SAU SITE]",
  avatar: null,
};

export const testimonials = {
  label: "Au lucrat cu noi",
  /** Cardul din stânga rândului: nota + un rând scurt; partea dintre ** ** apare în accent. */
  rating: {
    placeholder: true,
    value: "[X.X]",
    text: "**[X]+ clienți** [TEXT]",
  },
  avatarPlaceholderLabel: "Avatar",
  items: [
    { ...testimonialPlaceholder },
    { ...testimonialPlaceholder },
    { ...testimonialPlaceholder },
    { ...testimonialPlaceholder },
  ] satisfies Testimonial[],
};

/* ───────────────────────── 5.8 Cifre ───────────────────────── */

export type Stat = {
  placeholder?: boolean;
  icon: LucideIcon;
  /** Etichetă mică, în accent, deasupra valorii. */
  label: string;
  /** Dacă începe cu un număr (ex. „120+"), face count-up; altfel se afișează direct. */
  value: string;
  /** Textul de sub valoare. */
  text: string;
};

export const stats = {
  items: [
    { placeholder: true, icon: FolderCheck, label: "[ETICHETĂ]", value: "[X]+", text: "Proiecte livrate" },
    {
      placeholder: true,
      icon: Eye,
      label: "[ETICHETĂ]",
      value: "[X] mil.+",
      text: "Vizualizări pe proiectele lucrate",
    },
    { placeholder: true, icon: Timer, label: "[ETICHETĂ]", value: "[X] ore", text: "Timp de răspuns" },
    { placeholder: true, icon: Rocket, label: "[ETICHETĂ]", value: "[X] zile", text: "Până la prima implementare" },
  ] satisfies Stat[],
};

/* ───────────────────────── 5.9 Analiză gratuită + formular ───────────────────────── */

export const offer = {
  id: anchors.offer,
  /** Eticheta mică de deasupra secțiunii. */
  eyebrow: "Primul pas",
  /** Partea dintre ** ** apare în culoarea de accent. */
  title: "Analiză **gratuită**",
  subtitle:
    "Află unde pierde firma ta timp și clienți. Într-o discuție de 20 de minute îți arătăm concret ce se poate automatiza și ce impact ar avea.",
  benefits: [
    "Pe firma ta, nu teorie generală",
    "Vezi exact unde pierzi timp și clienți",
    "Primești idei concrete, gata de aplicat",
    "Tu alegi pe ce ne concentrăm",
    "Fără obligații",
  ],
  form: {
    optional: "(opțional)",
    step1: {
      title: "Spune-ne despre firmă",
      company: "Numele firmei",
      website: "Website sau pagină de social media",
      interests: {
        label: "Ce te interesează?",
        options: [
          "Lead-uri și conversații",
          "Conținut automat",
          "Aplicație sau automatizare la comandă",
          "Website",
          "Nu știu încă",
        ],
      },
      next: "Continuă",
    },
    step2: {
      title: "Încă câteva detalii",
      name: "Nume",
      email: "Email",
      phone: { label: "Telefon", prefix: "+40" },
      message: "Mesaj scurt",
      consent: {
        text: "Sunt de acord cu prelucrarea datelor conform",
        linkLabel: "Politicii de confidențialitate",
        href: routes.privacy,
      },
      submit: "Trimite cererea",
    },
    duration: "Durează 10 secunde.",
    success: "Mulțumim! Te contactăm în cel mult [X] ore.",
  },
  /** Sub card: „sau" + telefon și email. */
  alternative: "sau",
};

/* ───────────────────────── Datele firmei ───────────────────────── */

/** Folosite în footer și în paginile legale. */
export const company = {
  placeholder: true,
  legalName: "[DENUMIRE FIRMĂ] S.R.L.",
  cui: "[ ]",
  regCom: "[ ]",
  address: "[ADRESA SEDIULUI], Sibiu, România",
  city: "Sibiu, România",
};

/* ───────────────────────── Date de contact ───────────────────────── */

export const contact = {
  phone: { label: "[TELEFON]", href: "tel:[TELEFON]" },
  email: { label: "[EMAIL]", href: "mailto:[EMAIL]" },
  whatsapp: {
    /** Număr în format internațional, fără + și spații (ex. 40712345678). */
    number: "[NUMĂR]",
    message: "Salut! Aș vrea să aflu mai multe despre implementarea AI în firma mea.",
  },
};

/* ───────────────────────── 5.10 CTA final ───────────────────────── */

export const finalCta = {
  title: "Ai un proiect?",
  primary: { label: "Hai să vorbim", href: toSection(anchors.offer) } satisfies LinkItem,
  whatsappLabel: "WhatsApp",
};

/* ───────────────────────── 5.11 Despre ───────────────────────── */

export type Founder = {
  placeholder?: boolean;
  name: string;
  role: string;
  /** Roluri scurte; partea dintre ** ** apare îngroșată. */
  highlights: string[];
  photo: ImageRef;
};

export const about = {
  /** Eticheta mică de deasupra secțiunii. */
  label: "Despre noi",
  id: anchors.about,
  title: "Cine suntem",
  photoPlaceholderLabel: "Poză fondator",
  founders: [
    {
      placeholder: true,
      name: "Teti",
      role: "Tehnic și implementare",
      highlights: ["**Implementare** AI", "**Automatizări**"],
      photo: null,
    },
    {
      placeholder: true,
      name: "David",
      role: "Design și brand",
      highlights: ["**Brand** Designer", "**UI/UX** Designer"],
      photo: null,
    },
  ] satisfies Founder[],
  text: {
    placeholder: true,
    value:
      "Construim soluții AI care chiar sunt folosite. Credem că **tehnologia bună** începe cu **înțelegerea afacerii**, comunicare deschisă și rezultate pe care le vezi în prima lună.",
  },
};

/* ───────────────────────── 5.12 Footer ───────────────────────── */

export const footer = {
  /** Afișat ca: „© {brand.name}. {rights} {anul curent}." */
  rights: "Toate drepturile rezervate",
  legalLinks: [
    { label: "Politica de confidențialitate", href: routes.privacy },
    { label: "Politica de cookies", href: routes.cookies },
    { label: "Termeni și condiții", href: routes.terms },
  ] satisfies LinkItem[],
  anpcLinks: [
    { label: "ANPC", href: "https://anpc.ro/" },
    { label: "ANPC - SAL", href: "https://anpc.ro/ce-este-sal/" },
  ] satisfies LinkItem[],
  social: [
    { placeholder: true, name: "Instagram", href: "[URL INSTAGRAM]", icon: siInstagram },
    { placeholder: true, name: "TikTok", href: "[URL TIKTOK]", icon: siTiktok },
  ] satisfies { placeholder?: boolean; name: string; href: string; icon: SimpleIcon }[],
  /** „[DENUMIRE FIRMĂ] S.R.L. · CUI [ ] · Nr. Reg. Com. [ ] · Sibiu, România" (din `company`). */
  companyLine: `${company.legalName} · CUI ${company.cui} · Nr. Reg. Com. ${company.regCom} · ${company.city}`,
};

/* ───────────────────────── 5.13 CTA plutitor ───────────────────────── */

export const floatingCta = {
  line1: "Află unde pierzi timp și clienți.",
  line2: "Primești o analiză gratuită.",
  href: toSection(anchors.offer),
};

/* ═══════════════════════════════════════════════════════════════════════
   6. PAGINI LEGALE · DE VERIFICAT înainte de lansare
   Draft scris de Claude conform GDPR, pentru un site de prezentare cu
   formular de contact. NU este consultanță juridică: verifică-l (ideal cu
   un avocat sau un consultant GDPR) și completează placeholder-ele [ ].
   Blocuri: un string = paragraf, un array = listă cu buline.
   În text: **îngroșat** și [text link](adresă).
   ═══════════════════════════════════════════════════════════════════════ */

export type LegalBlock = string | string[];
export type LegalDocument = {
  route: string;
  title: string;
  description: string;
  updated: string;
  intro: LegalBlock[];
  sections: { title: string; body: LegalBlock[] }[];
};

const operator = `${company.legalName}, cu sediul în ${company.address}, CUI ${company.cui}, Nr. Reg. Com. ${company.regCom}`;
const privacyLink = `[Politica de confidențialitate](${routes.privacy})`;
const cookiesLink = `[Politica de cookies](${routes.cookies})`;

const privacy: LegalDocument = {
  route: routes.privacy,
  title: "Politica de confidențialitate",
  description: `Ce date personale colectăm prin site-ul ${brand.name}, de ce, cât timp le păstrăm și ce drepturi ai.`,
  updated: "[DATA]",
  intro: [
    `Această politică explică ce date personale colectăm prin site-ul ${brand.name}, de ce le colectăm, cum le folosim și ce drepturi ai. Prelucrăm datele conform Regulamentului (UE) 2016/679 (GDPR) și legislației române privind protecția datelor.`,
  ],
  sections: [
    {
      title: "Cine este operatorul datelor",
      body: [
        `Operatorul datelor tale personale este ${operator} („noi”).`,
        `Pentru orice întrebare despre datele tale ne poți scrie la ${contact.email.label} sau ne poți suna la ${contact.phone.label}.`,
      ],
    },
    {
      title: "Ce date colectăm",
      body: [
        "Prin formularul „Analiză gratuită” colectăm doar datele pe care ni le dai tu:",
        [
          "numele firmei și, opțional, website-ul sau pagina de social media a firmei;",
          "serviciile care te interesează;",
          "numele tău, adresa de email și numărul de telefon;",
          "mesajul pe care ni-l scrii, dacă alegi să ne scrii unul;",
          "confirmarea acordului tău pentru prelucrarea datelor.",
        ],
        "Când vizitezi site-ul, furnizorul de hosting prelucrează automat date tehnice necesare funcționării și securității, de exemplu adresa IP, tipul de browser și data accesării.",
        "Pentru statistici de trafic folosim Vercel Web Analytics, care funcționează fără cookie-uri și ne arată doar date agregate (de exemplu numărul de vizite pe pagină), fără să te identifice.",
        "Nu îți cerem categorii speciale de date (de exemplu date despre sănătate) și te rugăm să nu le incluzi în mesaj.",
      ],
    },
    {
      title: "De ce folosim datele și pe ce temei legal",
      body: [
        [
          "**Ca să răspundem cererii tale** de analiză gratuită, să te contactăm și să pregătim discuția. Temeiul este efectuarea demersurilor pe care ni le ceri înainte de o eventuală colaborare (art. 6 alin. (1) lit. b) GDPR) și acordul tău, exprimat prin bifarea căsuței din formular (art. 6 alin. (1) lit. a) GDPR).",
          "**Ca să protejăm site-ul** și formularul împotriva abuzurilor și a mesajelor automate (spam). Temeiul este interesul nostru legitim de a asigura securitatea site-ului (art. 6 alin. (1) lit. f) GDPR).",
          "**Ca să înțelegem, la nivel agregat, cum este folosit site-ul**, pentru a-l îmbunătăți. Temeiul este interesul nostru legitim (art. 6 alin. (1) lit. f) GDPR); aceste statistici nu te identifică.",
        ],
        "Nu folosim datele tale pentru marketing fără acordul tău separat și nu luăm decizii bazate exclusiv pe prelucrarea automată care să producă efecte juridice asupra ta.",
      ],
    },
    {
      title: "Cât timp păstrăm datele",
      body: [
        "Păstrăm datele trimise prin formular cât timp este nevoie ca să răspundem cererii tale. Dacă nu începem o colaborare, le ștergem după cel mult [12 luni] de la ultima noastră comunicare.",
        "Dacă lucrăm împreună, datele devin parte din relația contractuală și le păstrăm pe durata contractului, apoi pe perioadele cerute de lege (de exemplu pentru documentele financiar-contabile).",
        "Datele tehnice prelucrate de furnizorul de hosting se păstrează pe perioade scurte, conform politicilor acestuia.",
      ],
    },
    {
      title: "Cui transmitem datele",
      body: [
        "Nu vindem și nu închiriem datele tale. Le transmitem doar furnizorilor care ne ajută să operăm site-ul, în calitate de persoane împuternicite, pe bază de contract și numai în măsura necesară:",
        [
          "**Vercel Inc.** (SUA): găzduirea site-ului și statisticile de trafic Vercel Web Analytics, fără cookie-uri;",
          "**Resend** (SUA): transmiterea pe email a cererilor trimise prin formular;",
          "[alte instrumente folosite pentru gestionarea cererilor, de exemplu un CRM sau n8n, dacă e cazul].",
        ],
        "Putem transmite date autorităților publice doar atunci când legea ne obligă.",
      ],
    },
    {
      title: "Transferuri în afara Spațiului Economic European",
      body: [
        "Unii furnizori (Vercel și Resend) au sediul în SUA, așa că datele pot fi transferate în afara Spațiului Economic European. În aceste cazuri, transferul se face pe baza garanțiilor prevăzute de GDPR: decizia de adecvare a Comisiei Europene privind cadrul UE-SUA pentru protecția datelor (EU-U.S. Data Privacy Framework), pentru furnizorii certificați, sau clauzele contractuale standard aprobate de Comisia Europeană.",
      ],
    },
    {
      title: "Cum protejăm datele",
      body: [
        "Folosim conexiuni criptate (HTTPS), dăm acces la date doar persoanelor din echipă care au nevoie de ele și lucrăm cu furnizori care aplică măsuri de securitate adecvate.",
      ],
    },
    {
      title: "Drepturile tale",
      body: [
        "În legătură cu datele tale personale ai următoarele drepturi:",
        [
          "**dreptul de acces**: să afli ce date avem despre tine;",
          "**dreptul la rectificare**: să corectezi datele inexacte;",
          "**dreptul la ștergere**: să ceri ștergerea datelor;",
          "**dreptul la restricționarea prelucrării**;",
          "**dreptul la portabilitatea datelor**;",
          "**dreptul de opoziție** la prelucrarea bazată pe interesul nostru legitim;",
          "**dreptul de a-ți retrage acordul** oricând, fără să fie afectată legalitatea prelucrării de până atunci;",
          "**dreptul de a depune o plângere** la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), [www.dataprotection.ro](https://www.dataprotection.ro).",
        ],
        `Ca să îți exerciți drepturile, scrie-ne la ${contact.email.label}. Îți răspundem fără întârzieri nejustificate și în cel mult o lună de la primirea cererii.`,
      ],
    },
    {
      title: "Minori",
      body: ["Site-ul se adresează firmelor. Nu colectăm cu bună știință date despre persoane sub 16 ani."],
    },
    {
      title: "Modificări ale acestei politici",
      body: [
        "Putem actualiza această politică atunci când se schimbă modul în care prelucrăm datele. Versiunea în vigoare este mereu cea publicată pe această pagină, cu data ultimei actualizări afișată sus.",
        `Despre cookie-uri găsești detalii în ${cookiesLink}.`,
      ],
    },
  ],
};

const cookies: LegalDocument = {
  route: routes.cookies,
  title: "Politica de cookies",
  description: `Ce cookie-uri folosește (și nu folosește) site-ul ${brand.name}.`,
  updated: "[DATA]",
  intro: [
    `Această politică explică dacă și cum folosește site-ul ${brand.name}, operat de ${company.legalName}, cookie-uri și tehnologii similare.`,
  ],
  sections: [
    {
      title: "Ce sunt cookie-urile",
      body: [
        "Cookie-urile sunt fișiere mici de text pe care un site le salvează în browserul tău. Unele sunt strict necesare ca site-ul să funcționeze; altele sunt folosite pentru statistici, personalizare sau publicitate.",
      ],
    },
    {
      title: "Ce cookie-uri folosim",
      body: [
        "Site-ul nostru **nu folosește cookie-uri de statistică, de marketing sau de urmărire**. De aceea nu îți afișăm un banner de cookies.",
        "Pentru statistici de trafic folosim Vercel Web Analytics, un serviciu care funcționează fără cookie-uri: nu salvează nimic în browserul tău și nu te urmărește de la un site la altul. Datele sunt agregate și nu te identifică.",
        "Furnizorul de hosting (Vercel) poate folosi, în situații excepționale, cookie-uri strict necesare pentru securitate, de exemplu ca să blocheze traficul automat abuziv. Acestea nu necesită acordul tău, potrivit legii.",
      ],
    },
    {
      title: "Site-uri externe",
      body: [
        "Site-ul conține linkuri către alte site-uri și servicii, de exemplu WhatsApp, Instagram, TikTok sau ANPC. Când le accesezi, acestea pot folosi propriile cookie-uri, conform politicilor lor, pe care nu le controlăm.",
      ],
    },
    {
      title: "Cum poți controla cookie-urile",
      body: [
        "Poți vedea, bloca sau șterge cookie-urile din setările browserului tău. Blocarea cookie-urilor strict necesare poate afecta funcționarea unor site-uri.",
      ],
    },
    {
      title: "Modificări",
      body: [
        "Dacă vom începe să folosim și alte cookie-uri, vom actualiza această politică și, acolo unde legea o cere, îți vom cere acordul înainte.",
      ],
    },
    {
      title: "Contact",
      body: [
        `Pentru întrebări despre această politică ne poți scrie la ${contact.email.label}. Modul în care prelucrăm datele personale este descris în ${privacyLink}.`,
      ],
    },
  ],
};

const terms: LegalDocument = {
  route: routes.terms,
  title: "Termeni și condiții",
  description: `Condițiile de folosire a site-ului ${brand.name}.`,
  updated: "[DATA]",
  intro: [
    `Acești termeni se aplică folosirii site-ului ${brand.name}. Folosind site-ul, ești de acord cu ei; dacă nu ești de acord, te rugăm să nu folosești site-ul.`,
  ],
  sections: [
    {
      title: "Cine suntem",
      body: [
        `Site-ul este operat de ${operator}. Ne poți contacta la ${contact.email.label} sau la ${contact.phone.label}.`,
      ],
    },
    {
      title: "Ce găsești pe site",
      body: [
        "Site-ul prezintă serviciile noastre de implementare a soluțiilor bazate pe inteligență artificială: chatboți, automatizări, conținut, aplicații și website-uri. Informațiile au caracter general și nu reprezintă o ofertă fermă.",
        "Condițiile concrete ale fiecărui proiect (livrabile, termene, preț) se stabilesc printr-o ofertă sau un contract separat.",
      ],
    },
    {
      title: "Analiza gratuită",
      body: [
        "Prin formularul de pe site poți cere o analiză gratuită. Cererea și discuția nu creează nicio obligație, nici pentru tine, nici pentru noi. Putem refuza cererile incomplete, evident false sau abuzive.",
      ],
    },
    {
      title: "Folosirea site-ului",
      body: [
        "Te rugăm să folosești site-ul cu bună-credință. Nu este permis:",
        [
          "să trimiți prin formular date false sau datele altor persoane fără acordul lor;",
          "să trimiți mesaje nesolicitate (spam) sau conținut ilegal;",
          "să încerci să accesezi fără drept sistemele site-ului sau să îi afectezi funcționarea.",
        ],
      ],
    },
    {
      title: "Proprietate intelectuală",
      body: [
        `Conținutul site-ului (texte, design, elemente grafice, logo) aparține ${company.legalName} sau partenerilor săi și este protejat de legislația privind drepturile de autor. Nu îl poți copia sau folosi în scop comercial fără acordul nostru scris.`,
        "Numele și logo-urile altor companii afișate pe site (de exemplu ale tool-urilor cu care lucrăm) aparțin proprietarilor lor și sunt folosite doar ca să arate cu ce servicii se pot integra soluțiile noastre.",
      ],
    },
    {
      title: "Limitarea răspunderii",
      body: [
        "Ne străduim ca informațiile de pe site să fie corecte și actuale, dar nu garantăm că sunt complete sau lipsite de erori. Rezultatele prezentate (de exemplu cifrele sau proiectele) sunt orientative și depind de fiecare afacere.",
        "Nu răspundem pentru pagubele indirecte rezultate din folosirea informațiilor de pe site sau din imposibilitatea temporară de a-l accesa.",
      ],
    },
    {
      title: "Linkuri către alte site-uri",
      body: ["Site-ul conține linkuri către site-uri externe. Nu răspundem pentru conținutul sau politicile acestora."],
    },
    {
      title: "Date personale și cookie-uri",
      body: [`Modul în care prelucrăm datele personale este descris în ${privacyLink}, iar folosirea cookie-urilor în ${cookiesLink}.`],
    },
    {
      title: "Legea aplicabilă și litigii",
      body: [
        "Acești termeni sunt guvernați de legea română. Orice neînțelegere o vom rezolva mai întâi pe cale amiabilă; dacă nu reușim, litigiul va fi soluționat de instanțele competente din România.",
        "Dacă ai calitatea de consumator, te poți adresa Autorității Naționale pentru Protecția Consumatorilor ([ANPC](https://anpc.ro/)) sau poți folosi procedurile de soluționare alternativă a litigiilor ([SAL](https://anpc.ro/ce-este-sal/)).",
      ],
    },
    {
      title: "Modificări",
      body: [
        "Putem actualiza acești termeni. Versiunea în vigoare este cea publicată pe această pagină, cu data ultimei actualizări afișată sus.",
      ],
    },
  ],
};

export const legal = {
  updatedLabel: "Ultima actualizare:",
  privacy,
  cookies,
  terms,
};

/* ═══════════════════════════════════════════════════════════════════════
   TEXTE FUNCȚIONALE · DE VERIFICAT
   Nu apar în spec: le-a scris Claude ca site-ul să fie accesibil și
   formularul să poată afișa erori. Verifică-le și ajustează-le.
   ═══════════════════════════════════════════════════════════════════════ */

export const ui = {
  skipToContent: "Sari la conținut",
  mainNav: "Navigare principală",
  footerNav: "Informații legale",
  socialLinks: "Rețele sociale",
  externalLink: "(se deschide într-un tab nou)",
  /** Butonul rotund cu săgeată de pe cardurile de proiect; urmat de numele proiectului. */
  visitSite: "Vezi site-ul",
  /** Click pe un card de proiect: „Detalii despre proiect: {nume}". */
  projectDetails: "Detalii despre proiect",
  close: "Închide",
  carousel: {
    previous: "Înapoi",
    next: "Înainte",
    goTo: "Mergi la cardul {page}",
  },
  form: {
    back: "Înapoi",
    step: "Pasul {current} din {total}",
    sending: "Se trimite…",
    errors: {
      companyRequired: "Completează numele firmei.",
      interestsRequired: "Alege cel puțin o opțiune.",
      nameRequired: "Completează numele.",
      emailRequired: "Completează adresa de email.",
      emailInvalid: "Adresa de email nu pare corectă.",
      phoneRequired: "Completează numărul de telefon.",
      phoneInvalid: "Numărul de telefon nu pare corect.",
      consentRequired: "Bifează acordul ca să putem trimite cererea.",
      tooLong: "Textul e prea lung.",
    },
    submitError: {
      message: "Cererea nu a putut fi trimisă. Încearcă din nou sau scrie-ne direct pe WhatsApp.",
      whatsapp: "Scrie-ne pe WhatsApp",
    },
  },
  /** Emailul cu lead-ul, trimis prin Resend. Etichetele câmpurilor vin din offer.form. */
  leadEmail: {
    /** Din spec: „Lead nou: [firmă]". */
    subject: "Lead nou: {company}",
    heading: "Lead nou de pe site",
    consent: "Acord prelucrare date",
    consentYes: "Da",
    sentAt: "Trimis la",
    empty: "—",
  },
};
