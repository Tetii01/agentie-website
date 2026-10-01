/**
 * Momentele intro-ului 3D, ca progres al scroll-ului (0 = începutul paginii, 1 = finalul distanței
 * --spacing-intro). Folosite și de scene, și de dezvăluirea site-ului (components/sections/Intro.tsx),
 * ca să rămână sincronizate. Fișier mic, fără three.js: se poate importa oriunde.
 *
 * Două variante, de comparat (se alege din adresă, vezi Intro.tsx):
 * - `portal` (implicită): submark-ul se formează, apoi camera zboară printr-un portal din mijlocul C-ului;
 * - `land` (?intro=2): logo-ul întreg se asamblează din piese, apoi zboară în header și devine logo-ul de acolo.
 */

export type IntroVariant = "portal" | "land";

export type IntroColors = { foreground: string; accent: string; background: string };

export type IntroSceneOptions = {
  /** Unde stă logo-ul din header (pentru varianta `land`, care aterizează acolo). */
  landingTarget?: () => DOMRect | null;
};

export type IntroScene = {
  render: (progress: number, time: number) => void;
  resize: () => void;
  dispose: () => void;
};

/** Ce exportă fiecare scenă (lib/intro-scene.ts, lib/intro-scene-land.ts). `null` = fără WebGL. */
export type CreateIntroScene = (
  canvas: HTMLCanvasElement,
  colors: IntroColors,
  options?: IntroSceneOptions,
) => IntroScene | null;

/** Indicația de scroll: inelul ei se umple până la `hintOut` și apoi dispare. Comun ambelor variante. */
const hint = {
  hintOut: [0.38, 0.48],
} as const;

export const portalTimeline = {
  ...hint,
  /** C-ul se rotește din trei-sferturi spre față. */
  assemble: [0, 0.5],
  /** Punctul face un arc peste inel... */
  orbit: [0, 0.45],
  /** ...și intră în deschiderea C-ului. */
  dock: [0.3, 0.5],
  /** Lumina din spatele logo-ului se stinge când logo-ul e complet. */
  glowOut: [0.4, 0.5],
  /** De aici, fundalul e desenat în scenă, cu o deschidere rotundă în mijlocul C-ului. */
  portal: 0.5,
  /** Deschiderea crește și arată site-ul din spate. */
  iris: [0.5, 0.6],
  /** Camera zboară prin deschidere. */
  zoom: [0.55, 0.88],
  /** Hero-ul crește la mărimea lui (și urcă la locul lui) în timp ce camera se apropie. */
  heroScale: [0.55, 0.86],
  /** Scena dispare după ce deschiderea a acoperit tot ecranul. */
  sceneOut: [0.82, 0.9],
  /** Header-ul revine și site-ul primește click-uri. */
  done: 0.84,
  /** Dacă scena 3D nu s-a încărcat încă: fundalul doar se estompează. */
  fallbackReveal: [0.55, 0.85],
} as const;

export const landTimeline = {
  ...hint,
  /** Piesele logo-ului (orbita, literele, punctul) se așază pe rând. */
  assemble: [0, 0.45],
  /** Cât durează așezarea unei piese; piesele pornesc decalat, una după alta. */
  piece: 0.28,
  /** Lumina din spatele logo-ului se stinge când logo-ul pleacă. */
  glowOut: [0.45, 0.55],
  /** Logo-ul zboară în header, la locul logo-ului de acolo, peste fundalul încă închis. */
  land: [0.5, 0.78],
  /** Metalul devine alb mat, ca logo-ul din header. */
  flatten: [0.62, 0.78],
  /** Header-ul apare în jurul logo-ului care a aterizat... */
  header: [0.78, 0.86],
  /** ...iar logo-ul 3D dispare, ca să rămână cel din header. */
  sceneOut: [0.84, 0.9],
  /** Abia apoi fundalul intro-ului dispare și se vede site-ul. */
  reveal: [0.72, 0.94],
  /** Hero-ul crește puțin, la mărimea lui. */
  heroScale: [0.72, 0.96],
  /** Site-ul primește click-uri. */
  done: 0.78,
  /** Dacă scena 3D nu s-a încărcat încă: fundalul doar se estompează. */
  fallbackReveal: [0.6, 0.86],
} as const;

export const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/** Cât de departe e `value` între `from` și `to` (0–1). */
export const range = (value: number, [from, to]: readonly [number, number]) => clamp01((value - from) / (to - from));

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOut = (t: number) => 1 - (1 - t) ** 3;
