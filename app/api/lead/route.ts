import { Resend } from "resend";
import { offer, ui } from "@/content/site";
import { createLeadSchema, formatPhone, MIN_FILL_MS, toFieldErrors, type Lead, type LeadErrors } from "@/lib/lead";

/**
 * POST /api/lead: primește formularul de analiză gratuită.
 *
 * 1. Anti-spam: honeypot completat sau trimis în mai puțin de 3 secunde de la încărcarea
 *    paginii → răspundem „ok", dar nu trimitem nimic.
 * 2. Validare cu aceeași schemă zod ca în browser (lib/lead.ts).
 * 3. Email prin Resend către LEAD_TO_EMAIL + POST JSON către LEAD_WEBHOOK_URL (dacă e setat).
 *    Eșecul webhook-ului nu blochează succesul dacă emailul a plecat.
 *
 * Fără variabile de mediu: în development afișează în consolă ce s-ar fi trimis și răspunde „ok";
 * în producție, dacă lead-ul nu a ajuns nicăieri, răspunde cu eroare (utilizatorul vede varianta WhatsApp).
 */

type Delivery = "sent" | "skipped" | "failed";
type LeadResponse = { ok: true } | { ok: false; error: "bad_request" | "validation" | "delivery"; errors?: LeadErrors };

const MAX_BODY_BYTES = 20_000;
const isDev = process.env.NODE_ENV === "development";
const schema = createLeadSchema(
  ui.form.errors,
  offer.form.step1.interests.options,
  offer.form.step1.idea.option,
).full;

const reply = (body: LeadResponse, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return reply({ ok: false, error: "bad_request" }, 413);
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return reply({ ok: false, error: "bad_request" }, 413);
    body = JSON.parse(raw);
  } catch {
    return reply({ ok: false, error: "bad_request" }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return reply({ ok: false, error: "bad_request" }, 400);
  }

  const { hp, elapsedMs, ...fields } = body as Record<string, unknown>;
  if ((typeof hp === "string" && hp !== "") || typeof elapsedMs !== "number" || elapsedMs < MIN_FILL_MS) {
    if (isDev) console.info("[lead] Trimitere ignorată de filtrul anti-spam.", { hp, elapsedMs });
    return reply({ ok: true });
  }

  const parsed = schema.safeParse(fields);
  if (!parsed.success) {
    return reply({ ok: false, error: "validation", errors: toFieldErrors(parsed.error) }, 400);
  }

  const lead = parsed.data;
  const submittedAt = new Date();
  const [email, webhook] = await Promise.all([sendEmail(lead, submittedAt), sendWebhook(lead, submittedAt)]);

  if (email === "sent" || webhook === "sent") return reply({ ok: true });
  if (isDev && email === "skipped") return reply({ ok: true });
  return reply({ ok: false, error: "delivery" }, 502);
}

/* ───────────────────────── Email (Resend) ───────────────────────── */

async function sendEmail(lead: Lead, submittedAt: Date): Promise<Delivery> {
  const { RESEND_API_KEY: apiKey, LEAD_TO_EMAIL: to, LEAD_FROM_EMAIL: from } = process.env;
  const message = buildEmail(lead, submittedAt);

  if (!apiKey || !to || !from) {
    if (isDev) {
      console.info(
        "[lead] RESEND_API_KEY / LEAD_TO_EMAIL / LEAD_FROM_EMAIL lipsesc: emailul NU a fost trimis. S-ar fi trimis:\n" +
          `Subiect: ${message.subject}\n\n${message.text}\n`,
      );
    } else {
      console.error("[lead] Resend nu e configurat: setează RESEND_API_KEY, LEAD_TO_EMAIL și LEAD_FROM_EMAIL.");
    }
    return "skipped";
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: to.split(",").map((address) => address.trim()).filter(Boolean),
      replyTo: lead.email,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    if (error) {
      console.error("[lead] Resend a refuzat emailul:", error.message);
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("[lead] Eroare la trimiterea emailului:", error);
    return "failed";
  }
}

function buildEmail(lead: Lead, submittedAt: Date) {
  const t = ui.leadEmail;
  const f = offer.form;
  const rows: [label: string, value: string][] = [
    [f.step1.company, lead.company],
    [f.step1.website, lead.website || t.empty],
    [f.step1.interests.label, lead.interests.join(", ")],
    [f.step1.idea.label, lead.idea || t.empty],
    [f.step2.name, lead.name],
    [f.step2.email, lead.email],
    [f.step2.phone.label, formatPhone(lead.phone)],
    [f.step2.message, lead.message || t.empty],
    [t.consent, t.consentYes],
    [t.sentAt, formatDate(submittedAt)],
  ];

  const withColon = (label: string) => (/[?:]$/.test(label) ? label : `${label}:`);
  const subject = t.subject.replace("{company}", lead.company.replace(/\s+/g, " "));
  const text = `${t.heading}\n\n${rows.map(([label, value]) => `${withColon(label)} ${value}`).join("\n")}`;
  const html =
    `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5">` +
    `<h2 style="margin:0 0 16px">${escapeHtml(t.heading)}</h2>` +
    `<table cellpadding="6" style="border-collapse:collapse">` +
    rows
      .map(
        ([label, value]) =>
          `<tr><td style="color:#666;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>` +
          `<td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
      )
      .join("") +
    `</table></div>`;

  return { subject, text, html };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Bucharest",
  }).format(date);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/* ───────────────────────── Webhook (n8n / CRM) ───────────────────────── */

async function sendWebhook(lead: Lead, submittedAt: Date): Promise<Delivery> {
  const url = process.env.LEAD_WEBHOOK_URL;
  const payload = { ...lead, phone: `+40${lead.phone}`, submittedAt: submittedAt.toISOString(), source: "site" };

  if (!url) {
    if (isDev) console.info("[lead] LEAD_WEBHOOK_URL nu e setat: webhook sărit. Payload:\n" + JSON.stringify(payload, null, 2));
    return "skipped";
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error(`[lead] Webhook-ul a răspuns cu ${response.status}.`);
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("[lead] Webhook-ul nu a răspuns:", error);
    return "failed";
  }
}
