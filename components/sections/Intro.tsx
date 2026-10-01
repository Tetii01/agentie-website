"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { useLenis } from "@/components/ui/SmoothScroll";
import {
  clamp01,
  easeInOut,
  easeOut,
  type CreateIntroScene,
  type IntroScene,
  type IntroVariant,
  landTimeline,
  portalTimeline,
  range,
} from "@/lib/intro-timeline";

type IntroProps = {
  /** Indicația de jos („Derulează pentru a intra pe site"), din ui.intro. */
  hint: string;
  /** Hero-ul: stă fixat sub intro și apare la final. */
  children: ReactNode;
};

/**
 * Intro-ul 3D de pe prima pagină, în două variante de comparat (lib/intro-timeline.ts):
 * - `portal` (implicită): submark-ul Creos se formează pe măsură ce derulezi, apoi în mijlocul C-ului
 *   se deschide un „portal" prin care se vede site-ul și camera zboară prin el (lib/intro-scene.ts);
 * - `land` (adresa cu ?intro=2): logo-ul întreg se asamblează din piese, apoi zboară în header și
 *   devine logo-ul de acolo, în timp ce site-ul apare (lib/intro-scene-land.ts).
 *
 * Cum funcționează:
 * - hero-ul (children) stă `sticky` sus, iar sub el un spațiu gol (`intro-spacer`, înălțimea
 *   tokenului --spacing-intro) dă distanța de scroll a animației. La finalul ei, pagina curge normal;
 * - peste tot stă un strat fix (`intro-overlay`): fundalul închis cu o lumină în accent, scena 3D
 *   (încărcată la nevoie) și indicația de scroll, al cărei inel se umple pe măsură ce derulezi;
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
  const ringRef = useRef<SVGCircleElement>(null);

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
    const ring = ringRef.current;
    if (!reveal || !spacer || !overlay || !backdrop || !glowElement || !canvas || !hintElement || !ring) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const variant: IntroVariant = new URLSearchParams(window.location.search).get("intro") === "2" ? "land" : "portal";
    root.dataset.introVariant = variant;
    const timeline = variant === "land" ? landTimeline : portalTimeline;

    let scene: IntroScene | null = null;
    let disposed = false;
    let frame = 0;
    let running = false;
    let last = 0;

    const distance = () => Math.max(spacer.offsetHeight, 1);
    // Portal: cât trebuie coborât hero-ul ca mijlocul lui să fie în mijlocul ecranului, în spatele
    // portalului (pe telefon hero-ul e mai scurt decât ecranul). Urcă la locul lui cât camera trece prin portal.
    let centerOffset = 0;
    const measure = () => {
      centerOffset = Math.max(window.innerHeight / 2 - reveal.offsetHeight / 2, 0);
    };
    measure();
    const readTarget = () => clamp01(window.scrollY / distance());
    let target = readTarget();
    let current = target;

    /** Fundalul și hero-ul, varianta `portal`. */
    const applyPortal = (progress: number) => {
      const t = portalTimeline;
      if (scene) {
        // De la `portal`, fundalul e în scenă și site-ul se vede doar prin deschiderea din C.
        backdrop.style.opacity = progress < t.portal ? "1" : "0";
        reveal.style.opacity = "1";
      } else {
        // Scena nu s-a încărcat încă: fundalul doar se estompează peste site.
        const revealed = easeOut(range(progress, t.fallbackReveal));
        backdrop.style.opacity = String(1 - revealed);
        reveal.style.opacity = String(revealed);
      }
      // Hero-ul crește la mărimea lui și urcă la locul lui cât camera trece prin portal.
      const scale = easeInOut(range(progress, t.heroScale));
      reveal.style.transform =
        scale < 1 ? `translateY(${centerOffset * (1 - scale)}px) scale(${0.88 + 0.12 * scale})` : "";
      root.dataset.intro = progress < t.done ? "playing" : "done";
    };

    /** Fundalul, hero-ul și header-ul, varianta `land`. */
    const applyLand = (progress: number) => {
      const t = landTimeline;
      const revealed = easeOut(range(progress, scene ? t.reveal : t.fallbackReveal));
      backdrop.style.opacity = String(1 - revealed);
      reveal.style.opacity = scene ? "1" : String(revealed);
      const scale = easeInOut(range(progress, t.heroScale));
      reveal.style.transform = scale < 1 ? `scale(${0.96 + 0.04 * scale})` : "";
      // Header-ul apare peste logo-ul 3D care tocmai a aterizat în el.
      root.dataset.intro = progress < t.done ? "playing" : "done";
      root.style.setProperty("--intro-header", String(range(progress, t.header)));
    };

    const apply = (progress: number) => {
      if (variant === "land") applyLand(progress);
      else applyPortal(progress);
      glowElement.style.opacity = String(1 - range(progress, timeline.glowOut));
      reveal.style.pointerEvents = progress < timeline.done ? "none" : "";
      canvas.style.opacity = String(scene ? 1 - range(progress, timeline.sceneOut) : 0);
      // Indicația: inelul se umple până când logo-ul e gata, apoi indicația dispare.
      ring.style.strokeDashoffset = String(1 - range(progress, [0, timeline.hintOut[0]]));
      hintElement.style.opacity = String(1 - range(progress, timeline.hintOut));
      overlay.style.visibility = progress >= 0.999 ? "hidden" : "";
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
    const colors = {
      foreground: styles.getPropertyValue("--color-foreground").trim(),
      accent: styles.getPropertyValue("--color-accent").trim(),
      background: styles.getPropertyValue("--color-background").trim(),
    };
    const load: Promise<{ createIntroScene: CreateIntroScene }> =
      variant === "land" ? import("@/lib/intro-scene-land") : import("@/lib/intro-scene");
    load.then(({ createIntroScene }) => {
      if (disposed) return;
      scene = createIntroScene(canvas, colors, {
        landingTarget: () =>
          document.querySelector("[data-site-header] svg[role='img']")?.getBoundingClientRect() ?? null,
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
      delete root.dataset.introVariant;
      root.style.removeProperty("--intro-header");
    };
  }, []);

  return (
    <div className="relative">
      <noscript>
        <style>{".intro-overlay,.intro-spacer{display:none!important}"}</style>
      </noscript>

      <div className="sticky top-0">
        <div ref={revealRef}>{children}</div>
      </div>
      <div ref={spacerRef} data-intro-spacer aria-hidden className="intro-spacer h-intro" />

      <div ref={overlayRef} aria-hidden className="intro-overlay pointer-events-none fixed inset-0 z-[55]">
        <div ref={backdropRef} className="absolute inset-0 bg-background" />
        <div ref={glowRef} className="intro-glow absolute inset-0" />
        <canvas ref={canvasRef} className="absolute inset-0 size-full opacity-0" />

        {/* Indicația de scroll: o pilulă ca restul butoanelor de pe site, cu un inel care se umple. */}
        <div ref={hintRef} className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-10">
          <div className="control-border rounded-pill p-px">
            <div className="flex items-center gap-3 rounded-pill bg-control py-1.5 pr-1.5 pl-5 text-sm font-medium whitespace-nowrap text-foreground md:gap-4 md:py-2 md:pr-2 md:pl-6 md:text-base">
              {hint}
              <span className="relative grid size-9 shrink-0 place-items-center md:size-10">
                <svg viewBox="0 0 40 40" className="absolute inset-0 size-full -rotate-90">
                  <circle cx="20" cy="20" r="18.5" fill="none" strokeWidth="1.5" className="stroke-border" />
                  <circle
                    ref={ringRef}
                    cx="20"
                    cy="20"
                    r="18.5"
                    fill="none"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1"
                    strokeDashoffset="1"
                    className="stroke-accent"
                  />
                </svg>
                <ArrowDown className="size-4 animate-scroll-hint text-accent" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
