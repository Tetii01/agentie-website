import * as z from "zod/mini";

/**
 * Schema formularului de analiză, folosită identic în browser (components/sections/LeadForm.tsx)
 * și pe server (app/api/lead/route.ts). Mesajele de eroare și opțiunile vin din content/site.ts,
 * prin parametri, ca fișierul ăsta să nu tragă tot conținutul în JavaScript-ul din browser.
 * Folosește `zod/mini` (aceeași validare, de ~4 ori mai puțin JavaScript în browser decât `zod`).
 */

export type LeadMessages = {
  companyRequired: string;
  interestsRequired: string;
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  phoneInvalid: string;
  consentRequired: string;
  tooLong: string;
};

/** Valorile din formular, exact cum le completează utilizatorul. */
export type LeadValues = {
  company: string;
  website: string;
  interests: string[];
  name: string;
  email: string;
  /** Fără prefixul +40, care e afișat fix lângă câmp. */
  phone: string;
  message: string;
  consent: boolean;
};

export type LeadField = keyof LeadValues;
export type LeadErrors = Partial<Record<LeadField, string>>;

export const STEP1_FIELDS: LeadField[] = ["company", "website", "interests"];

/** Timpul minim (de la încărcarea paginii) sub care o trimitere e considerată spam. */
export const MIN_FILL_MS = 3000;

/**
 * Numărul fără prefix, doar cifre: „0712 345 678" → „712345678", „40712345678" → „712345678".
 */
export function normalizePhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("40")) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function createLeadSchema(m: LeadMessages, interestOptions: readonly string[]) {
  const text = (max: number, required?: string) =>
    z.string().check(z.trim(), ...(required ? [z.minLength(1, required)] : []), z.maxLength(max, m.tooLong));

  const step1 = z.object({
    company: text(120, m.companyRequired),
    website: text(200),
    interests: z.array(z.string()).check(
      z.refine((list) => list.length > 0, m.interestsRequired),
      z.refine((list) => list.every((item) => interestOptions.includes(item)), m.interestsRequired),
    ),
  });

  const step2 = z.object({
    name: text(120, m.nameRequired),
    email: z.pipe(text(200, m.emailRequired), z.email(m.emailInvalid)),
    // Număr românesc: 9 cifre după +40 (ex. 712 345 678).
    phone: z.pipe(
      z.pipe(text(40, m.phoneRequired), z.transform(normalizePhone)),
      z.string().check(z.regex(/^\d{9}$/, m.phoneInvalid)),
    ),
    message: text(2000),
    consent: z.boolean().check(z.refine((accepted) => accepted, m.consentRequired)),
  });

  return { step1, step2, full: z.object({ ...step1.shape, ...step2.shape }) };
}

export type Lead = z.output<ReturnType<typeof createLeadSchema>["full"]>;

/** Primul mesaj de eroare pentru fiecare câmp. */
export function toFieldErrors(error: Parameters<typeof z.flattenError>[0]): LeadErrors {
  const fieldErrors = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  const result: LeadErrors = {};
  for (const [field, messages] of Object.entries(fieldErrors)) {
    if (messages?.[0]) result[field as LeadField] = messages[0];
  }
  return result;
}

/** „712345678" → „+40 712 345 678". */
export function formatPhone(digits: string) {
  return `+40 ${digits.replace(/^(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3")}`;
}
