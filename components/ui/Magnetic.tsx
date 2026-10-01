"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type MagneticProps = {
  children: ReactNode;
  /** Cât din distanța până la cursor urmează elementul (0–1). */
  strength?: number;
  className?: string;
};

/**
 * Element „magnetic" (din „motion footer"): urmărește cursorul cât e deasupra lui, se înclină puțin
 * și crește ușor, apoi revine elastic când cursorul pleacă. Doar pe dispozitivele cu mouse/trackpad
 * și fără prefers-reduced-motion. Tranzițiile sunt în app/globals.css (.magnetic).
 */
export function Magnetic({ children, strength = 0.4, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Poziția măsurată la intrare, fără transformare: altfel elementul și-ar muta singur centrul.
    let box: DOMRect | null = null;

    const onEnter = () => {
      element.style.transform = "";
      box = element.getBoundingClientRect();
    };
    const onMove = (event: PointerEvent) => {
      box ??= element.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      element.dataset.magnet = "follow";
      element.style.transform =
        `perspective(600px) translate3d(${(x * strength).toFixed(1)}px, ${(y * strength).toFixed(1)}px, 0) ` +
        `rotateX(${(-y * 0.15).toFixed(2)}deg) rotateY(${(x * 0.15).toFixed(2)}deg) scale(1.05)`;
    };
    const onLeave = () => {
      box = null;
      element.dataset.magnet = "release";
      element.style.transform = "";
    };

    element.addEventListener("pointerenter", onEnter);
    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    return () => {
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={ref} className={cn("magnetic", className)}>
      {children}
    </div>
  );
}
