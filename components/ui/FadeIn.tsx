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
  as?: "div" | "li" | "span";
  className?: string;
};

// Un singur IntersectionObserver pentru toate elementele FadeIn de pe pagină.
// Toggle: clasa is-visible se pune când elementul intră în ecran și se scoate
// când iese, deci animația se repetă și la scroll în sus.
let observer: IntersectionObserver | null = null;

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.classList.toggle("is-visible", entry.isIntersecting);
    },
    { threshold: 0.1 },
  );
  return observer;
}

export function FadeIn({ children, delay = 0, eager = false, as = "div", className }: FadeInProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as "div";

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const io = getObserver();
    io.observe(element);
    return () => io.unobserve(element);
  }, []);

  return (
    <Tag
      ref={ref as RefObject<HTMLDivElement>}
      className={cn("fade-in-section", eager && "fade-in-eager is-visible", className)}
      style={delay ? ({ "--fade-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
