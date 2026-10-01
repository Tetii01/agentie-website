"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { useLenis } from "@/components/ui/SmoothScroll";
import {
  clamp01,
  type CreateIntroScene,
  easeInOut,
  easeOut,
  type IntroScene,
  introTimeline as timeline,
  range,
} from "@/lib/intro-timeline";

type IntroProps = {
  /** Indicația de jos („Derulează pentru a intra pe site"), din ui.intro. */
  hint: string;
  /** Hero-ul: stă fixat sub intro și apare la final. */
  children: ReactNode;
};

/** Cât durează apariția logo-ului 3D după ce scena e gata (ms). */
const SCENE_FADE_IN = 600;

/**
 * Intro-ul 3D de pe prima pagină: submark-ul Creos se formează pe măsură ce derulezi (C-ul se întoarce
 * spre față, punctul face un arc peste el și intră în deschidere), apoi în mijlocul C-ului se deschide un
 * „portal" prin care se vede site-ul, camera zboară prin el și apar hero-ul și header-ul.
 * Scena: lib/intro-scene.ts. Momentele: lib/intro-timeline.ts.
 *
 * Cum funcționează:
 * - hero-ul (children) stă `sticky` sus, iar sub el un spațiu gol (`intro-spacer`, înălțimea
 *   tokenului --spacing-intro) dă distanța de scroll a animației. La finalul ei, pagina curge normal;
 * - peste tot stă un strat fix (`intro-overlay`): fundalul închis cu o lumină în accent în mijloc, scena 3D
 *   (încărcată la nevoie), pe margini rețeaua de puncte din hero și două lumini care plutesc, iar jos
 *   indicația de scroll, al cărei inel se umple pe măsură ce derulezi;
 * - progresul (0–1) = cât din spațiul gol s-a derulat, citit o dată pe cadru. Lenis netezește deja
 *   scroll-ul, iar pe telefon scroll-ul nativ e fluid, deci nu mai e netezit încă o dată (ar rămâne în urmă);
 * - header-ul se ascunde cât rulează intro-ul (`html[data-intro="playing"]` în app/globals.css).
 *
 * Fluiditate: în fiecare cadru se scrie în pagină doar ce s-a schimbat; hero-ul doar se mută (nu se mărește)
 * și e strat separat (`will-change`) cât timp se mișcă, ca să nu fie redesenat la fiecare cadru; stratul 3D are înălțimea
 * fixă a ecranului mare (lvh), ca bara browserului de pe telefon să nu-l redimensioneze în timpul scroll-ului.
 *
 * Fără JavaScript, la prefers-reduced-motion sau fără WebGL, intro-ul nu apare deloc.
 */
export function Intro({ hint, children }: IntroProps) {
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const revealRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sidesRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    const reveal = revealRef.current;
    const spacer = spacerRef.current;
    const stage = stageRef.current;
    const backdrop = backdropRef.current;
    const glowElement = glowRef.current;
    const sides = sidesRef.current;
    const canvas = canvasRef.current;
    const hintElement = hintRef.current;
    const ring = ringRef.current;
    if (!reveal || !spacer || !stage || !backdrop || !glowElement || !sides || !canvas || !hintElement || !ring) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let scene: IntroScene | null = null;
    let readyAt = 0;
    let disposed = false;
    let frame = 0;
    let running = false;
    let lastScrollAt = 0;

    // Scrie în pagină doar valorile care s-au schimbat față de cadrul anterior.
    const written = new WeakMap<Element, Record<string, string>>();
    const setStyle = (element: HTMLElement | SVGElement, property: string, value: string) => {
      let values = written.get(element);
      if (!values) written.set(element, (values = {}));
      if (values[property] === value) return;
      values[property] = value;
      element.style.setProperty(property, value);
    };
    const setState = (state: string) => {
      if (root.dataset.intro !== state) root.dataset.intro = state;
    };
    const fixed = (value: number, digits = 3) => value.toFixed(digits);

    // Măsurători, refăcute doar la redimensionare (citirea lor la fiecare cadru ar forța reflow).
    let distance = 1;
    // Cât trebuie coborât hero-ul ca mijlocul lui să fie în mijlocul ecranului, în spatele portalului
    // (pe telefon hero-ul e mai scurt decât ecranul). Urcă la locul lui cât camera trece prin portal.
    let centerOffset = 0;
    const measure = () => {
      distance = Math.max(spacer.offsetHeight, 1);
      centerOffset = Math.max(window.innerHeight / 2 - reveal.offsetHeight / 2, 0);
    };
    measure();
    const readProgress = () => clamp01(window.scrollY / distance);

    const apply = (progress: number, sceneFade: number) => {
      if (scene) {
        // De la `portal`, fundalul e în scenă și site-ul se vede doar prin deschiderea din C.
        setStyle(backdrop, "opacity", progress < timeline.portal ? "1" : "0");
        setStyle(reveal, "opacity", "1");
      } else {
        // Scena nu s-a încărcat încă: fundalul doar se estompează peste site.
        const revealed = easeOut(range(progress, timeline.fallbackReveal));
        setStyle(backdrop, "opacity", fixed(1 - revealed));
        setStyle(reveal, "opacity", fixed(revealed));
      }
      // Hero-ul urcă la locul lui cât camera trece prin portal. Doar mutat, nu și mărit: o mărire
      // l-ar face pe Safari (iPhone) să-l redeseneze la fiecare cadru, cu tot cu glow-urile lui.
      const rise = easeInOut(range(progress, timeline.heroRise));
      setStyle(reveal, "transform", rise < 1 ? `translate3d(0, ${fixed(centerOffset * (1 - rise), 1)}px, 0)` : "none");
      setStyle(reveal, "pointer-events", progress < timeline.done ? "none" : "auto");
      setStyle(glowElement, "opacity", fixed(1 - range(progress, timeline.glowOut)));
      setStyle(sides, "opacity", fixed(1 - easeInOut(range(progress, timeline.sidesOut))));
      setStyle(canvas, "opacity", fixed(sceneFade * (1 - range(progress, timeline.sceneOut))));
      // Indicația: inelul se umple până când logo-ul e gata, apoi indicația dispare.
      setStyle(ring, "stroke-dashoffset", fixed(1 - range(progress, [0, timeline.hintOut[0]])));
      setStyle(hintElement, "opacity", fixed(1 - range(progress, timeline.hintOut)));
      const visibility = progress >= 1 ? "hidden" : "visible";
      setStyle(stage, "visibility", visibility);
      setStyle(hintElement, "visibility", visibility);
      setState(progress < timeline.done ? "playing" : "done");
    };

    const tick = (now: number) => {
      const progress = readProgress();
      const sceneFade = scene ? easeOut(clamp01((now - readyAt) / SCENE_FADE_IN)) : 0;
      // Hero-ul e strat separat cât timp intro-ul rulează; după ce scroll-ul s-a oprit la final,
      // e redesenat o singură dată, clar (nu în timpul scroll-ului, ca să nu sacadeze).
      const settled = progress >= 1 && now - lastScrollAt > 250;
      setStyle(reveal, "will-change", settled ? "auto" : "transform");
      apply(progress, sceneFade);
      if (scene && progress < timeline.sceneOut[1]) scene.render(progress, now / 1000);

      if (settled && (!scene || sceneFade >= 1)) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || disposed) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      lastScrollAt = performance.now();
      start();
    };

    const onResize = () => {
      measure();
      scene?.resize();
      start();
    };

    // Cine ajunge cu tastatura (Tab) la butoanele din hero sare direct la finalul intro-ului.
    const onFocus = () => {
      if (readProgress() >= 1) return;
      if (lenisRef.current) lenisRef.current.scrollTo(distance, { immediate: true });
      else window.scrollTo({ top: distance });
    };

    apply(readProgress(), 0);
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
    import("@/lib/intro-scene")
      .then(({ createIntroScene }: { createIntroScene: CreateIntroScene }) => createIntroScene(canvas, colors))
      .then((created) => {
        if (disposed) {
          created?.dispose();
          return;
        }
        if (!created) {
          // Fără WebGL: fără intro, pagina începe direct cu hero-ul.
          setState("off");
          return;
        }
        scene = created;
        readyAt = performance.now();
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
        <div ref={revealRef}>{children}</div>
      </div>
      <div ref={spacerRef} data-intro-spacer aria-hidden className="intro-spacer h-intro" />

      {/* Înălțimea ecranului mare (lvh): pe telefon, bara browserului nu-l redimensionează în timpul scroll-ului. */}
      <div ref={stageRef} aria-hidden className="intro-overlay pointer-events-none fixed inset-x-0 top-0 z-[55] h-lvh">
        <div ref={backdropRef} className="absolute inset-0 bg-background" />
        <div ref={glowRef} className="intro-glow absolute inset-0" />
        <canvas ref={canvasRef} className="absolute inset-0 size-full opacity-0" />
        {/* Marginile: rețeaua de puncte din hero și două lumini în accent care plutesc încet; mijlocul rămâne
            curat. Deasupra scenei, ca să rămână și peste fundalul portalului (dispar cât camera trece prin el).
            Luminile plutesc doar de la tabletă în sus; pe telefon stau pe loc (mai puțin de lucru pentru telefon). */}
        <div ref={sidesRef} className="absolute inset-0 overflow-hidden">
          <div className="intro-side-glow absolute inset-[-10%] md:animate-intro-drift" />
          <div className="intro-side-dots absolute inset-0" />
        </div>
      </div>

      {/* Indicația de scroll: o pilulă ca restul butoanelor de pe site, cu un inel care se umple.
          Separat de strat, ca să stea mereu deasupra barei browserului de pe telefon. */}
      <div
        ref={hintRef}
        aria-hidden
        className="intro-overlay pointer-events-none fixed inset-x-0 bottom-0 z-[55] flex justify-center pb-6 md:pb-10"
      >
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
  );
}
