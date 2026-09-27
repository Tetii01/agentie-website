"use client";

import type Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const LenisContext = createContext<Lenis | null>(null);

/** Instanța Lenis curentă (null cât timp nu e pornită sau la prefers-reduced-motion). */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Smooth scroll cu Lenis pentru toată pagina. Montat o singură dată în app/layout.tsx.
 * Nu pornește deloc dacă utilizatorul are prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let instance: Lenis | null = null;
    let cancelled = false;

    import("lenis").then(({ default: LenisClass }) => {
      if (cancelled) return;
      instance = new LenisClass({ autoRaf: true, duration: 0.6 });
      setLenis(instance);
    });

    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
