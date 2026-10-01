"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/cn";

type FadeInProps = {
  children: ReactNode;
  /** Întârziere în ms, pentru stagger pe carduri (0, 80, 160, 240). */
  delay?: number;
  /**
   * Pentru elementele din hero: animația pornește din CSS la încărcare,
   * fără să aștepte JavaScript-ul. După aceea se comportă ca oricare FadeIn.
   */
  eager?: boolean;
  /** `blur`: coboară puțin și se clarifică (footer). Implicit: urcă. */
  variant?: "rise" | "blur";
  as?: "div" | "li" | "span";
  className?: string;
};

// Un singur IntersectionObserver pentru toate elementele FadeIn de pe pagină.
// Toggle: clasa is-visible se pune când elementul intră în ecran și se scoate
// când iese, deci animația se repetă și la scroll în sus.
// Un element observat („țintă") poate controla mai multe FadeIn-uri (vezi data-fade-group).
let observer: IntersectionObserver | null = null;
const members = new Map<Element, Set<HTMLElement>>();

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        members.get(entry.target)?.forEach((element) => element.classList.toggle("is-visible", entry.isIntersecting));
      }
    },
    { threshold: 0.1 },
  );
  return observer;
}

/**
 * Ținta observată pentru un element. Pe mobil, cardurile dintr-un rând cu derulare orizontală
 * (lista are `data-fade-group`) apar odată cu rândul, cu stagger. Altfel, cele din dreapta ar
 * rămâne invizibile până sunt glisate în ecran. De la tabletă în sus, fiecare card are fade-in propriu.
 */
function targetFor(element: HTMLElement) {
  const group = element.closest("[data-fade-group]");
  return group && window.matchMedia("(max-width: 47.99rem)").matches ? group : element;
}

export function FadeIn({ children, delay = 0, eager = false, variant = "rise", as = "div", className }: FadeInProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as "div";

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const target = targetFor(element);
    let group = members.get(target);
    if (!group) {
      group = new Set();
      members.set(target, group);
      getObserver().observe(target);
    }
    group.add(element);

    return () => {
      group.delete(element);
      if (group.size === 0) {
        members.delete(target);
        observer?.unobserve(target);
      }
    };
  }, []);

  return (
    <Tag
      ref={ref as RefObject<HTMLDivElement>}
      className={cn("fade-in-section", eager && "fade-in-eager is-visible", variant === "blur" && "fade-in-blur", className)}
      style={delay ? ({ "--fade-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
