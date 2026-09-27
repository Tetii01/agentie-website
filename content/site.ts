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
  Eye,
  FolderCheck,
  MessageCircleWarning,
  Repeat,
  Rocket,
  Shuffle,
  Timer,
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
  title: "Mai mulți clienți, mai puțină muncă.",
  /** Partea din titlu afișată în culoarea de accent. */
  highlight: "Cu AI.",
  subtitle:
    "Implementăm chatboți, automatizări și conținut generat cu AI, construite pe procesele firmei tale. Tu te ocupi de clienți, restul merge singur.",
  primaryCta: { label: "Vreau analiza gratuită", href: toSection(anchors.offer) } satisfies LinkItem,
  secondaryCta: { label: "Vezi ce construim", href: toSection(anchors.services) } satisfies LinkItem,
  visual: {
    placeholder: true,
    label: "Vizual brand",
    /** "rounded" = pătrat cu colțuri rotunjite, "circle" = rotund. */
    shape: "rounded" as "rounded" | "circle",
    image: null as ImageRef,
  },
};

/** Titlul și descrierea paginii (tab-ul browserului, Google, share). */
export const seo = {
  title: `${brand.name} · ${hero.title} ${hero.highlight}`,
  description: hero.subtitle,
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

/* ───────────────────────── 5.5 Servicii ───────────────────────── */

export const services = {
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
};

export const projects = {
  id: anchors.projects,
  title: "Proiecte",
  imagePlaceholderLabel: "Imagine proiect",
  items: [
    {
      placeholder: true,
      title: "[TITLU PROIECT 1]",
      category: "Website",
      description: "[DESCRIERE SCURTĂ]",
      url: "[URL PROIECT]",
      image: null,
    },
    {
      placeholder: true,
      title: "[TITLU PROIECT 2]",
      category: "Chatbot WhatsApp",
      description: "[DESCRIERE SCURTĂ]",
      url: "[URL PROIECT]",
      image: null,
    },
    {
      placeholder: true,
      title: "[TITLU PROIECT 3]",
      category: "Aplicație internă",
      description: "[DESCRIERE SCURTĂ]",
      url: "[URL PROIECT]",
      image: null,
    },
    {
      placeholder: true,
      title: "[TITLU PROIECT 4]",
      category: "Conținut automat",
      description: "[DESCRIERE SCURTĂ]",
      url: "[URL PROIECT]",
      image: null,
    },
    {
      placeholder: true,
      title: "[TITLU PROIECT 5]",
      category: "UI/UX Design",
      description: "[DESCRIERE SCURTĂ]",
      url: "[URL PROIECT]",
      image: null,
    },
    {
      placeholder: true,
      title: "[TITLU PROIECT 6]",
      category: "Website",
      description: "[DESCRIERE SCURTĂ]",
      url: "[URL PROIECT]",
      image: null,
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
  /** Partea dintre ** ** apare îngroșată. */
  quote: string;
  url: string;
  avatar: ImageRef;
};

const testimonialPlaceholder: Testimonial = {
  placeholder: true,
  name: "[NUME]",
  role: "[ROL]",
  followers: "[X] urmăritori",
  quote: "[CITAT] **[PARTE ÎNGROȘATĂ]** [CITAT]",
  url: "[URL PROFIL SAU SITE]",
  avatar: null,
};

export const testimonials = {
  label: "Au lucrat cu noi",
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
  eyebrow: "Primul pas",
  title: "Analiză gratuită",
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
  company: {
    placeholder: true,
    text: "[DENUMIRE FIRMĂ] S.R.L. · CUI [ ] · Nr. Reg. Com. [ ] · Sibiu, România",
  },
};

/* ───────────────────────── 5.13 CTA plutitor ───────────────────────── */

export const floatingCta = {
  line1: "Află unde pierzi timp și clienți.",
  line2: "Primești o analiză gratuită.",
  href: toSection(anchors.offer),
};

/* ═══════════════════════════════════════════════════════════════════════
   TEXTE FUNCȚIONALE · DE VERIFICAT
   Nu apar în spec: le-a scris Claude ca site-ul să fie accesibil și
   formularul să poată afișa erori. Verifică-le și ajustează-le.
   ═══════════════════════════════════════════════════════════════════════ */

export const ui = {
  skipToContent: "Sari la conținut",
  mainNav: "Navigare principală",
  externalLink: "(se deschide într-un tab nou)",
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
};
