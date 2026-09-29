"use client";

import { ArrowLeft, ArrowRight, Check, Clock, LoaderCircle, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { controlClasses, Field, FieldError } from "@/components/ui/Field";
import type { offer, ui } from "@/content/site";
import { cn } from "@/lib/cn";
import {
  createLeadSchema,
  STEP1_FIELDS,
  toFieldErrors,
  type LeadErrors,
  type LeadField,
  type LeadValues,
} from "@/lib/lead";

/** Textele vin prin props de la Offer.tsx (server), din content/site.ts. */
export type LeadFormTexts = {
  /** Limba paginii: serverul validează răspunsurile cu opțiunile din aceeași limbă. */
  locale: string;
  form: typeof offer.form;
  ui: typeof ui.form;
  newTabLabel: string;
  whatsappUrl: string;
};

type Status = "idle" | "submitting" | "success" | "error";
type TextField = "company" | "website" | "idea" | "name" | "email" | "phone" | "message";

const EMPTY: LeadValues = {
  company: "",
  website: "",
  interests: [],
  idea: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
};

const FIELD_ORDER: LeadField[] = ["company", "website", "interests", "idea", "name", "email", "phone", "message", "consent"];

/** Elementul care primește focus când câmpul are eroare. */
const focusId = (field: LeadField) => (field === "interests" ? "lead-interests-0" : `lead-${field}`);

/**
 * Formularul de analiză gratuită, în 2 pași, cu tranziție fade/slide între ei.
 * „Înapoi" păstrează tot ce s-a completat. Validare cu aceeași schemă ca pe server (lib/lead.ts).
 * Anti-spam: câmp capcană (hp) + timpul de la încărcarea paginii (verificat pe server).
 */
export function LeadForm({ texts }: { texts: LeadFormTexts }) {
  const { form, ui: t } = texts;
  const ideaOption = form.step1.idea.option;
  const schemas = useMemo(
    () => createLeadSchema(t.errors, form.step1.interests.options, ideaOption),
    [t.errors, form.step1.interests.options, ideaOption],
  );

  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState<"next" | "back" | null>(null);
  const [values, setValues] = useState<LeadValues>(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const honeypotRef = useRef<HTMLInputElement>(null);
  const stepTitleRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);

  // După schimbarea pasului: focus pe primul câmp cu eroare, altfel pe titlul pasului.
  useEffect(() => {
    if (!direction) return;
    const target = pendingFocus.current ? document.getElementById(pendingFocus.current) : stepTitleRef.current;
    pendingFocus.current = null;
    target?.focus({ preventScroll: true });
  }, [step, direction]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus({ preventScroll: true });
  }, [status]);

  function goTo(next: 1 | 2, focusField?: LeadField) {
    pendingFocus.current = focusField ? focusId(focusField) : null;
    setDirection(next === 2 ? "next" : "back");
    setStep(next);
  }

  function update<K extends LeadField>(field: K, value: LeadValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  }

  function toggleInterest(option: string) {
    const { interests } = values;
    const removing = interests.includes(option);
    update("interests", removing ? interests.filter((item) => item !== option) : [...interests, option]);
    // Câmpul pentru idee dispare odată cu opțiunea, deci și eroarea lui.
    if (removing && option === ideaOption) setErrors((current) => ({ ...current, idea: undefined }));
  }

  function showErrors(next: LeadErrors) {
    setErrors(next);
    const first = FIELD_ORDER.find((field) => next[field]);
    if (!first) return;
    if (step === 2 && STEP1_FIELDS.includes(first)) goTo(1, first);
    else document.getElementById(focusId(first))?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    if (step === 1) {
      const result = schemas.step1.safeParse(values);
      if (!result.success) return showErrors(toFieldErrors(result.error));
      setErrors({});
      goTo(2);
      return;
    }

    const result = schemas.full.safeParse(values);
    if (!result.success) return showErrors(toFieldErrors(result.error));

    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          locale: texts.locale,
          hp: honeypotRef.current?.value ?? "",
          elapsedMs: Math.round(performance.now()),
        }),
      });
      const data: { ok?: boolean; errors?: LeadErrors } | null = await response.json().catch(() => null);

      if (response.ok && data?.ok) {
        setStatus("success");
      } else if (data?.errors && Object.keys(data.errors).length > 0) {
        setStatus("idle");
        showErrors(data.errors);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  /** Proprietățile comune ale unui câmp text. */
  const textProps = (field: TextField) => ({
    id: `lead-${field}`,
    name: field,
    value: values[field],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(field, event.target.value),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `lead-${field}-error` : undefined,
  });

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex min-h-80 flex-col items-center justify-center gap-5 text-center outline-none animate-step-next motion-reduce:animate-none"
      >
        <span className="grid size-14 place-items-center rounded-full bg-accent/15 text-accent">
          <Check aria-hidden className="size-7" />
        </span>
        <p className="max-w-sm text-xl font-semibold tracking-tight text-balance md:text-2xl">{form.success}</p>
      </div>
    );
  }

  const submitting = status === "submitting";
  const animation = direction === "next" ? "animate-step-next" : direction === "back" ? "animate-step-back" : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate className="relative flex flex-col">
      {/* Anti-spam: câmp capcană, invizibil și inaccesibil pentru oameni. Boții îl completează. */}
      <div aria-hidden className="absolute top-0 -left-[10000px] size-px overflow-hidden">
        <input ref={honeypotRef} type="text" name="hp" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="flex items-center gap-3">
        <div aria-hidden className="flex gap-1.5">
          {[1, 2].map((n) => (
            <span
              key={n}
              className={cn("h-1 w-8 rounded-pill transition-colors duration-base", n <= step ? "bg-accent" : "bg-border")}
            />
          ))}
        </div>
        <p className="text-xs font-medium text-muted">
          {t.step.replace("{current}", String(step)).replace("{total}", "2")}
        </p>
      </div>

      <div key={step} className={cn("mt-5 flex flex-col gap-6 motion-reduce:animate-none", animation)}>
        <h3 ref={stepTitleRef} tabIndex={-1} className="text-xl font-semibold tracking-tight outline-none md:text-2xl">
          {step === 1 ? form.step1.title : form.step2.title}
        </h3>

        {step === 1 ? (
          <>
            <Field id="lead-company" label={form.step1.company} error={errors.company}>
              <input {...textProps("company")} type="text" autoComplete="organization" required className={cn(controlClasses, "h-12 px-4")} />
            </Field>

            <Field id="lead-website" label={form.step1.website} optionalLabel={form.optional} error={errors.website}>
              <input {...textProps("website")} type="text" inputMode="url" autoComplete="url" className={cn(controlClasses, "h-12 px-4")} />
            </Field>

            <fieldset aria-describedby={errors.interests ? "lead-interests-error" : undefined}>
              <legend className="text-sm font-medium text-foreground">{form.step1.interests.label}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {form.step1.interests.options.map((option, index) => {
                  const checked = values.interests.includes(option);
                  return (
                    <label key={option} className="cursor-pointer">
                      <input
                        id={`lead-interests-${index}`}
                        type="checkbox"
                        name="interests"
                        value={option}
                        checked={checked}
                        onChange={() => toggleInterest(option)}
                        className="peer sr-only"
                      />
                      <span
                        className={cn(
                          "inline-flex h-10 items-center gap-2 rounded-pill border border-border bg-surface-2 px-4 text-sm text-muted select-none",
                          "transition-colors duration-base hover:text-foreground",
                          "peer-checked:border-accent peer-checked:bg-accent/15 peer-checked:text-foreground",
                          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
                        )}
                      >
                        {checked && <Check aria-hidden className="size-4 text-accent" />}
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-2">
                <FieldError id="lead-interests-error" error={errors.interests} />
              </div>
            </fieldset>

            {/* Apare doar când clientul alege „propune-ne tu ceva". */}
            {values.interests.includes(ideaOption) && (
              <Field
                id="lead-idea"
                label={form.step1.idea.label}
                error={errors.idea}
                className="animate-step-next motion-reduce:animate-none"
              >
                <textarea
                  {...textProps("idea")}
                  rows={3}
                  placeholder={form.step1.idea.placeholder}
                  data-lenis-prevent
                  className={cn(controlClasses, "min-h-28 resize-y px-4 py-3 placeholder:text-muted/70")}
                />
              </Field>
            )}
          </>
        ) : (
          <>
            <Field id="lead-name" label={form.step2.name} error={errors.name}>
              <input {...textProps("name")} type="text" autoComplete="name" required className={cn(controlClasses, "h-12 px-4")} />
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="lead-email" label={form.step2.email} error={errors.email}>
                <input {...textProps("email")} type="email" autoComplete="email" required className={cn(controlClasses, "h-12 px-4")} />
              </Field>

              <Field id="lead-phone" label={form.step2.phone.label} error={errors.phone}>
                <div className="relative">
                  <span
                    id="lead-phone-prefix"
                    className="pointer-events-none absolute inset-y-3 left-0 flex items-center border-r border-border pr-3 pl-4 text-base text-muted"
                  >
                    {form.step2.phone.prefix}
                  </span>
                  <input
                    {...textProps("phone")}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    required
                    aria-describedby={cn("lead-phone-prefix", errors.phone && "lead-phone-error")}
                    className={cn(controlClasses, "h-12 pr-4 pl-20")}
                  />
                </div>
              </Field>
            </div>

            <Field id="lead-message" label={form.step2.message} optionalLabel={form.optional} error={errors.message}>
              <textarea {...textProps("message")} rows={3} data-lenis-prevent className={cn(controlClasses, "min-h-28 resize-y px-4 py-3")} />
            </Field>

            <div>
              <div className="flex items-start gap-3">
                <input
                  id="lead-consent"
                  name="consent"
                  type="checkbox"
                  required
                  checked={values.consent}
                  onChange={(event) => update("consent", event.target.checked)}
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={errors.consent ? "lead-consent-error" : undefined}
                  className="mt-0.5 size-5 shrink-0 cursor-pointer accent-accent"
                />
                <label htmlFor="lead-consent" className="cursor-pointer text-sm text-muted">
                  {form.step2.consent.text}{" "}
                  <a
                    href={form.step2.consent.href}
                    target="_blank"
                    rel="noopener"
                    className="text-foreground underline underline-offset-4 transition-colors duration-base hover:text-accent"
                  >
                    {form.step2.consent.linkLabel}
                    <span className="sr-only"> {texts.newTabLabel}</span>
                  </a>
                </label>
              </div>
              <div className="mt-2">
                <FieldError id="lead-consent-error" error={errors.consent} />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {step === 2 ? (
            <Button variant="ghost" onClick={() => goTo(1)} disabled={submitting}>
              <ArrowLeft aria-hidden className="size-4" />
              {t.back}
            </Button>
          ) : (
            <span aria-hidden />
          )}
          <Button type="submit" size="lg" disabled={submitting} aria-busy={submitting || undefined} className="w-full sm:w-auto">
            {step === 1 ? (
              <>
                {form.step1.next}
                <ArrowRight aria-hidden className="size-5" />
              </>
            ) : submitting ? (
              <>
                <LoaderCircle aria-hidden className="size-5 animate-spin" />
                {t.sending}
              </>
            ) : (
              form.step2.submit
            )}
          </Button>
        </div>

        <p className="flex items-center justify-center gap-2 text-sm text-muted sm:justify-end">
          <Clock aria-hidden className="size-4" />
          {form.duration}
        </p>

        {status === "error" && (
          <div role="alert" className="flex flex-col items-start gap-3 rounded-field border border-danger/40 bg-danger/10 p-4">
            <p className="text-sm text-foreground">{t.submitError.message}</p>
            <Button href={texts.whatsappUrl} variant="secondary" size="sm">
              <MessageCircle aria-hidden className="size-4" />
              {t.submitError.whatsapp}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
