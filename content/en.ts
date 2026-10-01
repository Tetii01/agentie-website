/**
 * TOT TEXTUL SITE-ULUI, ÎN ENGLEZĂ (pagina /en)
 *
 * Aceeași formă ca `ro` din content/site.ts. Ce nu depinde de limbă (numele brandului, imaginile,
 * linkurile, iconițele, datele firmei, paginile legale) se ia direct din varianta în română,
 * deci se schimbă într-un singur loc.
 * Paginile legale există doar în română: linkurile din footer duc acolo.
 */

import { ro, type SiteContent } from "./site";

const toSection = (id: string) => `#${id}`;
const { anchors, brand, company } = ro;

const hero = {
  title: "You run the business.",
  highlight: "AI does the rest.",
  subject: "AI",
  actions: ["takes your calls.", "reads your emails.", "writes your content.", "brings in clients.", "does the rest."],
  primaryCta: { label: "Get your free analysis", href: toSection(anchors.offer) },
};

/** Textele proiectelor, în aceeași ordine ca în română (imaginile și linkurile rămân cele de acolo). */
const projectTexts = [
  {
    title: "X Sweets and Coffee",
    category: "Website + AI chatbots",
    description: "A new website for a café, with built-in AI chatbots that answer customers instantly.",
    alt: "The X Sweets and Coffee website on a laptop, with desserts in front",
    details: [
      { title: "The client", text: "Café and patisserie in Păltiniș, Sibiu." },
      { title: "Website", text: "Showcase website with menu, gallery and reservations." },
      { title: "AI chatbots", text: "Built-in chatbots that instantly answer customer questions." },
      { title: "Result", text: "[RESULT]" },
    ],
  },
  {
    title: "AT Transport",
    category: "Internal app",
    description: "An app for a vehicle fleet: drivers report daily, and the admin sees everything in one place.",
    alt: "The AT Transport admin panel on a phone, next to a truck with the company logo",
    details: [
      { title: "The client", text: "Transport company with a vehicle fleet." },
      { title: "The app", text: "Drivers send their daily report from their phone in seconds." },
      { title: "Alerts", text: "Flags upcoming services and vehicles that haven't reported in." },
      { title: "Result", text: "[RESULT]" },
    ],
  },
  {
    title: "Swae Lee",
    category: "Graphic design",
    description: "Graphic design for Swae Lee's European tour and his social media.",
    alt: "Access pass and VIP wristbands for Swae Lee's tour, next to a laptop showing his YouTube channel",
    details: [
      { title: "The client", text: "Swae Lee, international artist." },
      { title: "The tour", text: "Materials for the Same Difference Tour, including access passes and VIP wristbands." },
      { title: "Social media", text: "Graphics for the artist's social media." },
      { title: "Result", text: "[RESULT]" },
    ],
  },
  {
    title: "Restaurant app",
    category: "Internal app",
    description:
      "An app for restaurants: waiters keep track of orders more easily, the bar and kitchen know what to prepare, and the manager sees everything live.",
    alt: "The manager panel of the restaurant app on a phone, with table orders and the status of each dish",
    details: [
      { title: "Waiters", text: "They see each table's orders and know when a dish is ready to serve." },
      { title: "Bar and kitchen", text: "Each sees only its own orders and marks them “in progress” or “ready”." },
      { title: "The manager", text: "Follows every order live, from the bar to the kitchen." },
      { title: "Result", text: "[RESULT]" },
    ],
  },
  { title: "[PROJECT TITLE 5]", category: "UI/UX Design" },
  { title: "[PROJECT TITLE 6]", category: "Website" },
];

/** Testimonialele, în aceeași ordine ca în română: rolurile traduse și citatele în română traduse. */
const testimonialTexts = [
  { role: "Artist", followers: "12M followers" },
  { role: "Artist", followers: "11M followers" },
  {
    role: "Café and patisserie, Sibiu",
    quote: "The website looks exactly like our place, and **the chatbot answers customers instantly**. Warmly recommended! ☕",
  },
  {
    role: "Transport company",
    quote:
      "The app made our work so much easier. **I see the whole fleet in one place**, and drivers report in seconds. Thank you!",
  },
  { role: "Media platform", followers: "44M followers" },
];

const detailsPlaceholder = [
  { title: "[TITLE]", text: "[TEXT]" },
  { title: "[TITLE]", text: "[TEXT]" },
  { title: "[TITLE]", text: "[TEXT]" },
];

const ideaOption = "Pitch us your own idea";

export const en: SiteContent = {
  ...ro,

  nav: {
    links: [
      { label: "Services", href: toSection(anchors.services) },
      { label: "Projects", href: toSection(anchors.projects) },
      { label: "About", href: toSection(anchors.about) },
    ],
    cta: { label: "Free analysis", href: toSection(anchors.offer) },
  },

  hero,

  seo: {
    title: `${brand.name} · ${hero.title} ${hero.highlight}`,
    description:
      "AI agency from Sibiu, Romania. We build AI agents, custom apps, automations and hardware-based systems, plus design and video. It all starts with a free analysis.",
  },

  tools: { ...ro.tools, label: "We connect AI to the tools you already use" },

  problems: {
    ...ro.problems,
    title: "Sound familiar?",
    items: [
      {
        icon: ro.problems.items[0].icon,
        title: "Customers left without an answer",
        text: "A missed call or a message read the next day often means a customer who went with someone else.",
      },
      {
        icon: ro.problems.items[1].icon,
        title: "Content that keeps getting postponed",
        text: "You know you should post regularly, but between clients and daily work there's no time left to film and edit.",
      },
      {
        icon: ro.problems.items[2].icon,
        title: "The same tasks, every day",
        text: "Emails, spreadsheets, reports, the same messages sent dozens of times. Work that could run on its own.",
      },
      {
        icon: ro.problems.items[3].icon,
        title: "Information all over the place",
        text: "Clients on WhatsApp, quotes in Excel, notes on paper. Nothing talks to anything, and something always slips.",
      },
    ],
    closing: "All of this can be fixed. And it doesn't mean hiring someone new.",
  },

  services: {
    ...ro.services,
    title: "What we build",
    subtitle:
      "In short: anything. From an assistant that answers your calls to full apps and systems with cameras and sensors. We don't sell packages: we start from what's slowing you down.",
    items: [
      {
        title: "Custom apps and systems",
        description:
          "Built around the way you work. For example: an app that edits your footage, suggests content ideas with scripts and posts on its own, or a system that cuts returns for an online store.",
        tags: ["Web and mobile apps", "CRMs", "Automations", "Websites"],
      },
      {
        title: "AI agents",
        description:
          "Assistants that never take a break: they answer calls and chats, read and summarize your emails, qualify leads and send you only what matters.",
        tags: ["Voice agents", "Website and WhatsApp chat", "Emails", "Qualified leads"],
      },
      {
        title: "Systems with hardware",
        description:
          "When software alone isn't enough, we add the equipment too. For example, cameras on sports fields: players get their match on their phone, with highlights and stats.",
        tags: ["Cameras and sensors", "Installation", "Stats", "Mobile app"],
      },
      {
        title: "Design, video and production",
        description:
          "We handle the creative side too: graphic design, video editing, creative direction and production for companies, artists and events.",
        tags: ["Graphic design", "Video editing", "Creative direction", "Events"],
      },
    ],
    custom: {
      title: "Don't see your idea here?",
      text: "Tell us what you have in mind. If it can be imagined, it can be built.",
      cta: { label: "Let's talk", href: toSection(anchors.offer) },
    },
  },

  projects: {
    ...ro.projects,
    title: "Projects",
    imagePlaceholderLabel: "Project image",
    items: ro.projects.items.map((project, index) => {
      const { alt, details, ...text } = projectTexts[index];
      return {
        ...project,
        ...text,
        description: text.description ?? "[SHORT DESCRIPTION]",
        url: project.placeholder ? "[PROJECT URL]" : project.url,
        image: project.image && alt ? { ...project.image, alt } : project.image,
        details: details ?? detailsPlaceholder,
      };
    }),
  },

  testimonials: {
    ...ro.testimonials,
    label: "They worked with us",
    rating: { ...ro.testimonials.rating, text: "across **300+ clients**" },
    // Citatele în engleză rămân ca atare; cele în română sunt traduse.
    items: ro.testimonials.items.map((item, index) => ({ ...item, ...testimonialTexts[index] })),
  },

  stats: {
    items: [
      { ...ro.stats.items[0], label: "So far", text: "Projects delivered" },
      { ...ro.stats.items[1], label: "On the content we worked on", value: "50M+", text: "Views" },
      { ...ro.stats.items[2], label: "We reply within", value: "2 hours", text: "Response time" },
      { ...ro.stats.items[3], label: "First system", value: "7 days", text: "From analysis to launch" },
    ],
  },

  offer: {
    ...ro.offer,
    eyebrow: "First step",
    title: "Free **analysis**",
    subtitle:
      "Tell us how you work, and in 20 minutes we'll show you what can be automated or built for your business, and what it would change. Explained simply, no jargon.",
    benefits: [
      "About your business, not general theory",
      "See clearly where you lose time and clients",
      "Concrete ideas, ready to use",
      "No technical jargon",
      "No strings attached",
    ],
    form: {
      optional: "(optional)",
      step1: {
        title: "Tell us about your business",
        company: "Company name",
        website: "Website or social media page",
        interests: {
          label: "What are you interested in?",
          options: [
            "AI agent (phone, chat, email)",
            "App or automation",
            "Social media content",
            "System with hardware",
            "Design, video or production",
            ideaOption,
          ],
        },
        idea: {
          option: ideaOption,
          label: "Describe your idea",
          placeholder: "What would you like us to build? A few lines are enough.",
        },
        next: "Continue",
      },
      step2: {
        title: "A few more details",
        name: "Name",
        email: "Email",
        phone: { label: "Phone", prefix: ro.offer.form.step2.phone.prefix },
        message: "Short message",
        consent: {
          text: "I agree to the processing of my data according to the",
          linkLabel: "Privacy Policy (in Romanian)",
          href: ro.offer.form.step2.consent.href,
        },
        submit: "Send request",
      },
      duration: "Takes 10 seconds.",
      success: "Thank you! We'll get back to you within 2 hours.",
    },
    alternative: "or",
  },

  contact: {
    ...ro.contact,
    whatsapp: {
      ...ro.contact.whatsapp,
      message: "Hi! I'd like to find out more about bringing AI into my business.",
    },
  },

  finalCta: {
    ...ro.finalCta,
    title: "Got an idea in mind?",
    primary: { label: "Let's talk", href: toSection(anchors.offer) },
  },

  about: {
    ...ro.about,
    title: "Who we are",
    photoPlaceholderLabel: "Founder photo",
    founders: [
      {
        ...ro.about.founders[0],
        role: "Tech and implementation",
        highlights: ["**AI** agents", "**Custom** apps"],
      },
      {
        ...ro.about.founders[1],
        role: "Design and creative direction",
        highlights: ["**Graphic** design", "**Video** and production"],
      },
    ],
    text: {
      ...ro.about.text,
      value:
        "We're a small team from Sibiu with one goal: systems people actually use. We believe **good technology** starts with **understanding the business**. That's why we listen first, explain things simply and build only what helps you.",
    },
  },

  footer: {
    ...ro.footer,
    headings: { navigation: "Navigation", contact: "Contact", legal: "Legal", social: "Social" },
    rights: "All rights reserved",
    legalLinks: [
      { label: "Privacy policy (RO)", href: ro.footer.legalLinks[0].href },
      { label: "Cookie policy (RO)", href: ro.footer.legalLinks[1].href },
      { label: "Terms and conditions (RO)", href: ro.footer.legalLinks[2].href },
    ],
    companyLine: `${company.legalName} · Tax ID (CUI) ${company.cui} · Trade Reg. No. ${company.regCom} · Sibiu, Romania`,
  },

  floatingCta: {
    ...ro.floatingCta,
    line1: "Not sure where to start?",
    line2: "Get a free analysis.",
  },

  ui: {
    ...ro.ui,
    skipToContent: "Skip to content",
    mainNav: "Main navigation",
    footerNav: "Legal information",
    socialLinks: "Social media",
    onInstagram: "on Instagram",
    externalLink: "(opens in a new tab)",
    visitSite: "Visit website",
    projectDetails: "Project details",
    close: "Close",
    languageSwitch: { label: "RO", name: "Română", href: "/", lang: "ro" },
    carousel: {
      previous: "Previous",
      next: "Next",
      goTo: "Go to card {page}",
    },
    form: {
      back: "Back",
      step: "Step {current} of {total}",
      sending: "Sending…",
      errors: {
        companyRequired: "Please enter your company name.",
        interestsRequired: "Please choose at least one option.",
        ideaRequired: "Please tell us your idea in a few words.",
        nameRequired: "Please enter your name.",
        emailRequired: "Please enter your email address.",
        emailInvalid: "This email address doesn't look right.",
        phoneRequired: "Please enter your phone number.",
        phoneInvalid: "This phone number doesn't look right.",
        consentRequired: "Please tick the consent box so we can send your request.",
        tooLong: "This text is too long.",
      },
      submitError: {
        message: "Your request couldn't be sent. Please try again or message us directly on WhatsApp.",
        whatsapp: "Message us on WhatsApp",
      },
    },
    // Emailul cu lead-ul rămâne în română (e pentru noi), indiferent de limba paginii.
    leadEmail: ro.ui.leadEmail,
  },
};
