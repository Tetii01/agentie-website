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
  PhoneMissed,
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
  name: "Creos AI",
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
  actions: ["preia apelurile.", "citește emailurile.", "scrie conținutul.", "aduce clienți.", "face restul."],
  primaryCta: { label: "Cere analiza gratuită", href: toSection(anchors.offer) } satisfies LinkItem,
};

/** Titlul și descrierea paginii (tab-ul browserului, Google, share). */
export const seo = {
  title: `${brand.name} · ${hero.title} ${hero.highlight}`,
  description:
    "Agenție AI din Sibiu. Construim agenți AI, aplicații la comandă, automatizări și sisteme cu hardware, plus design și video. Începem cu o analiză gratuită.",
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
      icon: PhoneMissed,
      title: "Clienți care nu primesc răspuns",
      text: "Un apel ratat sau un mesaj citit a doua zi înseamnă, de multe ori, un client care a ales pe altcineva.",
    },
    {
      icon: Clapperboard,
      title: "Conținut amânat mereu",
      text: "Știi că trebuie să postezi constant, dar între clienți și operațional nu mai rămâne timp de filmat și editat.",
    },
    {
      icon: Repeat,
      title: "Aceleași task-uri, zi de zi",
      text: "Emailuri, tabele, rapoarte, aceleași mesaje trimise de zeci de ori. Muncă ce poate merge singură.",
    },
    {
      icon: Shuffle,
      title: "Informații împrăștiate",
      text: "Clienți în WhatsApp, oferte în Excel, notițe pe hârtie. Nimic nu comunică și mereu scapă ceva.",
    },
  ] satisfies { icon: LucideIcon; title: string; text: string }[],
  closing: "Toate au rezolvare. Și nu înseamnă să mai angajezi pe cineva.",
};

/* ───────────────────────── 5.5 Servicii ───────────────────────── */

export const services = {
  id: anchors.services,
  title: "Ce construim",
  subtitle:
    "Pe scurt: orice. De la un asistent care îți preia apelurile până la aplicații complete și sisteme cu camere și senzori. Nu vindem pachete: pornim de la ce te încurcă pe tine.",
  /** Primul serviciu e cardul lat (pe desktop), așa că are cea mai lungă descriere. */
  items: [
    {
      title: "Aplicații și sisteme la comandă",
      description:
        "Construite pe felul tău de lucru. De exemplu: o aplicație care îți editează filmările, îți propune idei de conținut cu scripturi și postează singură, sau un sistem care scade retururile unui magazin online.",
      tags: ["Aplicații web și mobile", "CRM-uri", "Automatizări", "Website-uri"],
    },
    {
      title: "Agenți AI",
      description:
        "Asistenți care nu iau pauză: răspund la telefon și pe chat, citesc și rezumă emailurile, califică clienții și îți trimit doar ce contează.",
      tags: ["Agenți vocali", "Chat pe site și WhatsApp", "Emailuri", "Clienți calificați"],
    },
    {
      title: "Sisteme cu hardware",
      description:
        "Când nu e de ajuns un program, adăugăm și aparatura. De exemplu, camere pe terenurile de sport: jucătorii primesc meciul pe telefon, cu faze bune și statistici.",
      tags: ["Camere și senzori", "Instalare", "Statistici", "Aplicație pe telefon"],
    },
    {
      title: "Design, video și producție",
      description:
        "Și partea creativă o facem noi: design grafic, editare video, direcție și producție creativă pentru firme, artiști și evenimente.",
      tags: ["Design grafic", "Editare video", "Direcție creativă", "Evenimente"],
    },
  ] satisfies { title: string; description: string; tags: string[] }[],
  /** „Ai altă idee?", în cardul cu titlul secțiunii. */
  custom: {
    title: "Ideea ta nu e aici?",
    text: "Spune-ne ce ai în minte. Dacă se poate gândi, se poate construi.",
    cta: { label: "Hai să vorbim", href: toSection(anchors.offer) } satisfies LinkItem,
  },
};

/* ───────────────────────── 5.6 Proiecte ───────────────────────── */

export type Project = {
  placeholder?: boolean;
  title: string;
  category: string;
  description: string;
  /** Linkul spre site (butonul rotund ↗). Gol = proiect fără site public, fără buton. */
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
      image: {
        src: "/proiecte/x-sweets-and-coffee-deserturi.webp",
        alt: "Site-ul X Sweets and Coffee pe un laptop, cu prăjituri în față",
      },
      details: [
        { title: "Clientul", text: "Cafenea și cofetărie din Păltiniș, Sibiu." },
        { title: "Website", text: "Site de prezentare cu meniu, galerie și rezervări." },
        { title: "Chatboți AI", text: "Chatboți integrați care răspund pe loc la întrebările clienților." },
        { title: "Rezultat", text: "[REZULTAT]" },
      ],
    },
    {
      title: "AT Transport",
      category: "Aplicație internă",
      description: "Aplicație pentru flota de mașini: șoferii raportează zilnic, iar administratorul vede totul într-un singur loc.",
      /** Aplicație internă, fără site public: gol = fără butonul spre site. */
      url: "",
      image: {
        src: "/proiecte/at-transport-camion.jpg",
        alt: "Panoul de administrator al aplicației AT Transport pe un telefon, lângă un camion cu sigla firmei",
      },
      details: [
        { title: "Clientul", text: "Firmă de transport cu o flotă de mașini." },
        { title: "Aplicația", text: "Șoferii trimit raportul zilnic din telefon, în câteva secunde." },
        { title: "Alerte", text: "Semnalează reviziile care se apropie și mașinile care nu au mai raportat." },
        { title: "Rezultat", text: "[REZULTAT]" },
      ],
    },
    {
      title: "Swae Lee",
      category: "Design grafic",
      description: "Design grafic pentru turneul european al lui Swae Lee și pentru rețelele lui de socializare.",
      url: "",
      image: {
        src: "/proiecte/swae-lee.webp",
        alt: "Ecuson de acces și brățări VIP pentru turneul lui Swae Lee, lângă un laptop cu canalul lui de YouTube",
      },
      details: [
        { title: "Clientul", text: "Swae Lee, artist internațional." },
        { title: "Turneul", text: "Materialele pentru Same Difference Tour, inclusiv ecusoanele de acces și brățările VIP." },
        { title: "Social media", text: "Grafică pentru rețelele de socializare ale artistului." },
        { title: "Rezultat", text: "[REZULTAT]" },
      ],
    },
    {
      title: "Aplicație restaurant",
      category: "Aplicație internă",
      description:
        "Aplicație pentru restaurant: ospătarii urmăresc comenzile mai ușor, barul și bucătăria știu ce au de pregătit, iar managerul vede totul live.",
      url: "",
      image: {
        src: "/proiecte/aplicatie-restaurant.webp",
        alt: "Panoul de manager al aplicației de restaurant pe un telefon, cu comenzile meselor și stadiul fiecărui preparat",
      },
      details: [
        { title: "Ospătarii", text: "Văd comenzile fiecărei mese și știu când un preparat e gata de servit." },
        { title: "Bar și bucătărie", text: "Fiecare vede doar comenzile lui și le marchează „în lucru” sau „gata”." },
        { title: "Managerul", text: "Urmărește live toate comenzile, de la bar până la bucătărie." },
        { title: "Rezultat", text: "[REZULTAT]" },
      ],
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
    // satisfies verifică fiecare proiect; `as` lasă tipul general, ca varianta în engleză să poată folosi alte texte.
  ] satisfies Project[] as Project[],
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
  /** Opțional: contul de Instagram (ex. „@nume"). Cu `url`, apare jos ca link spre profil. */
  handle?: string;
  /** Profilul de Instagram (cu `handle`) sau site-ul (afișat ca domeniu cu săgeată). Gol = fără link. */
  url: string;
  avatar: ImageRef;
};

export const testimonials = {
  label: "Au lucrat cu noi",
  /** Cardul din stânga rândului: nota + un rând scurt; partea dintre ** ** apare în accent. */
  rating: {
    value: "5.0",
    text: "de la **300+ clienți**",
  },
  avatarPlaceholderLabel: "Avatar",
  items: [
    {
      name: "Swae Lee",
      role: "Artist",
      followers: "12M urmăritori",
      verified: true,
      quote: "Absolutely killed the graphics for my europe tour, **everything came out crazy**. 🔥🔥",
      handle: "@swaelee",
      url: "https://www.instagram.com/swaelee/",
      avatar: { src: "/testimoniale/swaelee.jpg", alt: "" },
    },
    {
      name: "Rich The Kid",
      role: "Artist",
      followers: "11M urmăritori",
      verified: true,
      quote: "Smooth to work with, **in love with the results** too. Def gon keep in touch for the next projects 💯💯",
      handle: "@richthekid",
      url: "https://www.instagram.com/richthekid/",
      avatar: { src: "/testimoniale/richthekid.jpg", alt: "" },
    },
    {
      name: "X Sweets and Coffee",
      role: "Cafenea și cofetărie, Sibiu",
      quote:
        "Site-ul arată exact ca locul nostru, iar **chatbotul le răspunde clienților pe loc**. Recomandăm cu drag! ☕",
      handle: "@xsweetsandcoffee",
      url: "https://www.instagram.com/xsweetsandcoffee/",
      avatar: { src: "/testimoniale/xsweetsandcoffee.jpg", alt: "" },
    },
    {
      name: "AT Transport",
      role: "Firmă de transport",
      quote:
        "Aplicația ne-a ușurat mult treaba. **Văd toată flota într-un singur loc**, iar șoferii raportează în câteva secunde. Mulțumim!",
      url: "",
      avatar: null,
    },
    {
      name: "Worldstar",
      role: "Platformă media",
      followers: "44M urmăritori",
      verified: true,
      quote: "Big shoutout for the designs on our exclusive **Beach, Please! merch drop** 🏝️",
      handle: "@worldstar",
      url: "https://www.instagram.com/worldstar/",
      avatar: { src: "/testimoniale/worldstar.jpg", alt: "" },
    },
  ] satisfies Testimonial[] as Testimonial[],
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

/**
 * DE VERIFICAT înainte de lansare: cifrele trebuie să fie reale (pe site, o cifră care nu e adevărată
 * e reclamă înșelătoare). Proiectele livrate țin pasul cu „300+ clienți" din testimoniale,
 * iar timpul de răspuns e același cu cel din mesajul de după formular (offer.form.success).
 */
export const stats = {
  items: [
    { icon: FolderCheck, label: "Până acum", value: "350+", text: "Proiecte livrate" },
    { icon: Eye, label: "Pe conținutul lucrat", value: "50M+", text: "Vizualizări" },
    { icon: Timer, label: "Îți răspundem în", value: "2 ore", text: "Timp de răspuns" },
    { icon: Rocket, label: "Primul sistem", value: "7 zile", text: "De la analiză la lansare" },
  ] satisfies Stat[],
};

/* ───────────────────────── 5.9 Analiză gratuită + formular ───────────────────────── */

export const offer = {
  id: anchors.offer,
  eyebrow: "Primul pas",
  /** Partea dintre ** ** apare în culoarea de accent. */
  title: "Analiză **gratuită**",
  subtitle:
    "Ne povestești cum lucrezi, iar în 20 de minute îți arătăm ce se poate automatiza sau construi pentru firma ta și ce ar schimba. Explicat simplu, fără jargon.",
  benefits: [
    "Pe firma ta, nu teorie generală",
    "Vezi clar unde pierzi timp și clienți",
    "Idei concrete, gata de aplicat",
    "Fără termeni tehnici",
    "Fără nicio obligație",
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
          "Agent AI (telefon, chat, email)",
          "Aplicație sau automatizare",
          "Conținut pentru social media",
          "Sistem cu hardware",
          "Design, video sau producție",
          "Propune-ne tu ceva",
        ],
      },
      /** Când e bifată opțiunea `option` (una din lista de mai sus), apare câmpul pentru ideea clientului. */
      idea: {
        option: "Propune-ne tu ceva",
        label: "Descrie-ne ideea ta",
        placeholder: "Ce ai vrea să construim? Câteva rânduri sunt de ajuns.",
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
    success: "Mulțumim! Te contactăm în cel mult 2 ore.",
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
  title: "Ai o idee în minte?",
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
      highlights: ["**Agenți** AI", "**Aplicații** la comandă"],
      photo: null,
    },
    {
      placeholder: true,
      name: "David",
      role: "Design și direcție creativă",
      highlights: ["**Design** grafic", "**Video** și producție"],
      photo: null,
    },
  ] satisfies Founder[],
  text: {
    placeholder: true,
    value:
      "Suntem o echipă mică din Sibiu, cu un singur scop: sisteme care chiar sunt folosite. Credem că **tehnologia bună** începe cu **înțelegerea afacerii**. De aceea ascultăm întâi, explicăm simplu și construim doar ce te ajută.",
  },
};

/* ───────────────────────── 5.12 Footer ───────────────────────── */

export const footer = {
  /** Titlurile coloanelor din footer. */
  headings: { navigation: "Navigare", contact: "Contact", legal: "Legal", social: "Social" },
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
  line1: "Nu știi de unde să începi?",
  line2: "Cere o analiză gratuită.",
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
  /** Linkul de jos din cardurile de testimonial: „{@cont} pe Instagram". */
  onInstagram: "pe Instagram",
  externalLink: "(se deschide într-un tab nou)",
  /** Butonul rotund cu săgeată de pe cardurile de proiect; urmat de numele proiectului. */
  visitSite: "Vezi site-ul",
  /** Click pe un card de proiect: „Detalii despre proiect: {nume}". */
  projectDetails: "Detalii despre proiect",
  close: "Închide",
  /** Etichetele mici de jos din intro-ul de pe prima pagină (stânga, dreapta). */
  intro: { left: "Agenție AI", right: "Sibiu · România" },
  /** Butonul de limbă din hero: duce la varianta în engleză. */
  languageSwitch: { label: "EN", name: "English", href: "/en", lang: "en" },
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
      ideaRequired: "Scrie-ne pe scurt ideea ta.",
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
    /** Limba paginii de pe care a venit cererea (RO / EN). */
    language: "Limba site-ului",
    sentAt: "Trimis la",
    empty: "—",
  },
};

/* ───────────────────────── Tot conținutul, pe limbă ───────────────────────── */

/**
 * Conținutul în română, grupat. Varianta în engleză (content/en.ts) are exact aceeași formă.
 * Componentele îl iau prin getContent() din content/index.ts, după limba paginii.
 */
export const ro = {
  brand,
  anchors,
  nav,
  hero,
  seo,
  tools,
  problems,
  services,
  projects,
  testimonials,
  stats,
  offer,
  company,
  contact,
  finalCta,
  about,
  footer,
  floatingCta,
  legal,
  ui,
};

export type SiteContent = typeof ro;
