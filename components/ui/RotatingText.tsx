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
 * Ține minte care text e activ și îl schimbă la fiecare `interval`. Toate RotatingText-urile
 * din interior merg sincron.
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
