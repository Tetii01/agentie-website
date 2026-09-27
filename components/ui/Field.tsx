import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Stilul comun al câmpurilor (input, textarea). Înălțimea și padding-ul se adaugă la folosire. */
export const controlClasses = cn(
  "w-full rounded-field border border-border bg-surface-2 text-base text-foreground",
  "transition-colors duration-base hover:border-foreground/25 aria-invalid:border-danger",
);

type FieldProps = {
  id: string;
  label: string;
  /** Ex. „(opțional)", afișat discret după etichetă. */
  optionalLabel?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

/** Etichetă + câmp + mesaj de eroare. Câmpul primește `id`, iar eroarea are id-ul `${id}-error`. */
export function Field({ id, label, optionalLabel, error, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {optionalLabel && <span className="ml-1 font-normal text-muted">{optionalLabel}</span>}
      </label>
      {children}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="text-sm text-danger">
      {error}
    </p>
  );
}
