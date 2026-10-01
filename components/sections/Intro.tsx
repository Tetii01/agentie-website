"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLenis } from "@/components/ui/SmoothScroll";
import type { IntroScene } from "@/lib/intro-scene";
import { clamp01, easeInOut, easeOut, introTimeline as timeline, range } from "@/lib/intro-timeline";

type IntroProps = {
  /** Indicația de jos („Derulează"), din ui.intro. */
  hint: string;
  /** Hero-ul: stă fixat sub intro și apare la final. */
  children: ReactNode;
};

/**
 * Intro-ul 3D de pe prima pagină: submark-ul Creos se formează pe măsură ce derulezi,
 * apoi în mijlocul C-ului se deschide un „portal" prin care se vede site-ul, camera zboară prin el
 * și apar hero-ul și header-ul. Momentele exacte: lib/intro-timeline.ts.
 *
 * Cum funcționează:
 * - hero-ul (children) stă `sticky` sus, iar sub el un spațiu gol (`intro-spacer`, înălțimea
 *   tokenului --spacing-intro) dă distanța de scroll a animației. La finalul ei, pagina curge normal;
 * - peste tot stă un strat fix (`intro-overlay`): fundalul închis cu o lumină în accent, scena 3D
 *   (lib/intro-scene.ts, încărcată la nevoie) și indicația de scroll. Când logo-ul e complet, fundalul
 *   trece în scenă (portalul), iar stratul din pagină devine transparent;
 * - progresul (0–1) = cât din spațiul gol s-a derulat, netezit puțin ca mișcarea să fie fluidă.
 *   Același progres mișcă scena 3D și dezvăluirea hero-ului;
 * - header-ul se ascunde cât rulează intro-ul (`html[data-intro="playing"]` în app/globals.css).
 *
 * Fără JavaScript, la prefers-reduced-motion sau fără WebGL, intro-ul nu apare deloc.
 */
export function Intro({ hint, children }: IntroProps) {
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const revealRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    const reveal = revealRef.current;
    const spacer = spacerRef.current;
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const glowElement = glowRef.current;
    const canvas = canvasRef.current;
    const hintElement = hintRef.current;
    if (!reveal || !spacer || !overlay || !backdrop || !glowElement || !canvas || !hintElement) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let scene: IntroScene | null = null;
    let disposed = false;
    let frame = 0;
    let running = false;
    let last = 0;

    const distance = () => Math.max(spacer.offsetHeight, 1);
    // Cât trebuie coborât hero-ul ca mijlocul lui să fie în mijlocul ecranului, în spatele portalului
    // (pe telefon hero-ul e mai scurt decât ecranul). Urcă la locul lui cât camera trece prin portal.
    let centerOffset = 0;
    const measure = () => {
      centerOffset = Math.max(window.innerHeight / 2 - reveal.offsetHeight / 2, 0);
    };
    measure();
    const readTarget = () => clamp01(window.scrollY / distance());
    let target = readTarget();
    let current = target;

    const apply = (progress: number) => {
      if (scene) {
        // Cu scena 3D: de la `portal`, fundalul e în scenă și site-ul se vede doar prin deschiderea din C.
        backdrop.style.opacity = progress < timeline.portal ? "1" : "0";
        reveal.style.opacity = "1";
      } else {
        // Scena nu s-a încărcat încă: fundalul doar se estompează peste site.
        const revealed = easeOut(range(progress, timeline.fallbackReveal));
        backdrop.style.opacity = String(1 - revealed);
        reveal.style.opacity = String(revealed);
      }
      glowElement.style.opacity = String(1 - range(progress, timeline.glowOut));
      // Hero-ul crește la mărimea lui și urcă la locul lui cât camera trece prin portal.
      const scale = easeInOut(range(progress, timeline.heroScale));
      reveal.style.transform =
        scale < 1 ? `translateY(${centerOffset * (1 - scale)}px) scale(${0.88 + 0.12 * scale})` : "";
      reveal.style.pointerEvents = progress < timeline.done ? "none" : "";
      canvas.style.opacity = String(scene ? 1 - range(progress, timeline.sceneOut) : 0);
      hintElement.style.opacity = String(1 - range(progress, timeline.hint));
      overlay.style.visibility = progress >= 0.999 ? "hidden" : "";
      root.dataset.intro = progress < timeline.done ? "playing" : "done";
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      // Netezire: progresul afișat se apropie de cel real în ~0,1 s.
      current += (target - current) * (1 - Math.exp(-dt * 10));
      if (Math.abs(target - current) < 0.0005) current = target;

      apply(current);
      scene?.render(current, now / 1000);

      if (current >= 1 && target >= 1) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || disposed) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readTarget();
      start();
    };

    const onResize = () => {
      measure();
      scene?.resize();
      onScroll();
    };

    // Cine ajunge cu tastatura (Tab) la butoanele din hero sare direct la finalul intro-ului.
    const onFocus = () => {
      if (current >= 1) return;
      if (lenisRef.current) lenisRef.current.scrollTo(distance(), { immediate: true });
      else window.scrollTo({ top: distance() });
    };

    apply(current);
    start();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    reveal.addEventListener("focusin", onFocus);

    const styles = getComputedStyle(root);
    import("@/lib/intro-scene").then(({ createIntroScene }) => {
      if (disposed) return;
      scene = createIntroScene(canvas, {
        foreground: styles.getPropertyValue("--color-foreground").trim(),
        accent: styles.getPropertyValue("--color-accent").trim(),
        background: styles.getPropertyValue("--color-background").trim(),
      });
      if (!scene) {
        // Fără WebGL: fără intro, pagina începe direct cu hero-ul.
        root.dataset.intro = "off";
        return;
      }
      running = false;
      cancelAnimationFrame(frame);
      start();
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reveal.removeEventListener("focusin", onFocus);
      scene?.dispose();
      delete root.dataset.intro;
    };
  }, []);

  return (
    <div className="relative">
      <noscript>
        <style>{".intro-overlay,.intro-spacer{display:none!important}"}</style>
      </noscript>

      <div className="sticky top-0">
        <div ref={revealRef}>
          {children}
        </div>
      </div>
      <div ref={spacerRef} data-intro-spacer aria-hidden className="intro-spacer h-intro" />

      <div ref={overlayRef} aria-hidden className="intro-overlay pointer-events-none fixed inset-0 z-[55]">
        <div ref={backdropRef} className="absolute inset-0 bg-background" />
        <div ref={glowRef} className="intro-glow absolute inset-0" />
        <canvas ref={canvasRef} className="absolute inset-0 size-full opacity-0" />
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-xs font-medium tracking-wide text-muted md:bottom-10"
        >
          {hint}
          <span className="intro-hint-line h-10 w-px animate-scroll-hint" />
        </div>
      </div>
    </div>
  );
}
