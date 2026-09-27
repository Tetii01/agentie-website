"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 1400;

/** „120+" → { number: 120, decimals: 0, separator: ",", suffix: "+" }; „[X]+" → null. */
function parse(value: string) {
  const match = value.match(/^(\d+)(?:([.,])(\d+))?(.*)$/);
  if (!match) return null;
  const [, whole, separator = ",", fraction = "", suffix] = match;
  return { number: Number(`${whole}.${fraction || 0}`), decimals: fraction.length, separator, suffix };
}

/**
 * Valoare care numără de la 0 când intră pentru prima dată în ecran (o singură dată).
 * Dacă valoarea nu începe cu un număr (ex. placeholder „[X]+"), se afișează direct.
 * Fără JavaScript sau la prefers-reduced-motion se vede direct valoarea finală.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const parsed = parse(value);
    if (!element || !parsed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const format = (n: number) => n.toFixed(parsed.decimals).replace(".", parsed.separator) + parsed.suffix;
    let frame = 0;

    // Textul e scris direct în DOM, fără re-render la fiecare cadru.
    element.textContent = format(0);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out
          element.textContent = format(parsed.number * eased);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(element);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      element.textContent = value;
    };
  }, [value]);

  return (
    <span className={className}>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden>
        {value}
      </span>
    </span>
  );
}
