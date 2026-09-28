"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

type RotatingTextProps = {
  /** Textele care se schimbă pe rând. Ultimul rămâne pe ecran la prefers-reduced-motion. */
  items: string[];
  /** Cât stă fiecare text pe ecran, în ms. */
  interval?: number;
  className?: string;
};

/**
 * Un cuvânt / o expresie care se schimbă singură: cea nouă intră de jos (animate-word-in),
 * cea veche iese în sus (animate-word-out), amândouă cu blur. Doar decorativ (aria-hidden):
 * textul complet trebuie pus separat pentru cititoarele de ecran.
 * Primește textele prin props: componentele client nu importă content/site.ts.
 */
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function RotatingText({ items, interval = 2400, className }: RotatingTextProps) {
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
