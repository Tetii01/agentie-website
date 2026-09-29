"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

type Rotation = { items: string[]; index: number; previous: number | null };

const RotationContext = createContext<Rotation>({ items: [], index: 0, previous: null });

type RotationProviderProps = {
  /** Textele care se schimbă pe rând. Ultimul rămâne pe ecran la prefers-reduced-motion. */
  items: string[];
  /** Cât stă fiecare text pe ecran, în ms. */
  interval?: number;
  children: ReactNode;
};

/**
 * Ține minte care text e activ și îl schimbă la fiecare `interval`. Tot ce e în interior și
 * folosește RotatingText / RotationIndex merge sincron (ex. titlul din hero și indexul din dreapta).
 * Primește textele prin props: componentele client nu importă content/site.ts.
 */
export function RotationProvider({ items, interval = 2400, children }: RotationProviderProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
  const [state, setState] = useState<{ index: number; previous: number | null }>({ index: 0, previous: null });
  const { index, previous } = reducedMotion ? { index: items.length - 1, previous: null } : state;

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setState((current) => ({ index: (current.index + 1) % items.length, previous: current.index }));
    }, interval);
    return () => window.clearInterval(timer);
  }, [items.length, interval, reducedMotion]);

  return <RotationContext.Provider value={{ items, index, previous }}>{children}</RotationContext.Provider>;
}

/**
 * Textul activ: cel nou intră de jos (animate-word-in), cel vechi iese în sus (animate-word-out),
 * amândouă cu blur. Doar decorativ (aria-hidden): textul complet se pune separat pentru cititoarele de ecran.
 */
export function RotatingText({ className }: { className?: string }) {
  const { items, index, previous } = useContext(RotationContext);

  return (
    <span aria-hidden className={cn("inline-grid", className)}>
      {previous !== null && (
        <span key={`out-${previous}`} className="col-start-1 row-start-1 animate-word-out whitespace-nowrap">
          {items[previous]}
        </span>
      )}
      <span key={`in-${index}`} className="col-start-1 row-start-1 animate-word-in whitespace-nowrap">
        {items[index]}
      </span>
    </span>
  );
}

/**
 * Lista tuturor textelor, numerotată, cu cel activ evidențiat (alb + linie în accent).
 * Doar decorativă (aria-hidden). Textele se afișează fără punctul de la final, cu prima literă mare.
 */
export function RotationIndex({ className }: { className?: string }) {
  const { items, index } = useContext(RotationContext);

  return (
    <ol aria-hidden className={cn("flex flex-col gap-3.5", className)}>
      {items.map((item, position) => {
        const active = position === index;
        return (
          <li
            key={item}
            className={cn(
              "flex items-center justify-end gap-4 text-base transition-colors duration-500 ease-smooth",
              active ? "text-foreground" : "text-muted/60",
            )}
          >
            <span className="inline-block first-letter:uppercase">{item.replace(/\.$/, "")}</span>
            <span
              className={cn(
                "h-px transition-[width,background-color] duration-500 ease-smooth",
                active ? "w-8 bg-accent" : "w-4 bg-border",
              )}
            />
            <span className="w-5 text-label tabular-nums">{String(position + 1).padStart(2, "0")}</span>
          </li>
        );
      })}
    </ol>
  );
}
