/**
 * Momentele intro-ului 3D, ca progres al scroll-ului (0 = începutul paginii, 1 = finalul distanței
 * --spacing-intro). Folosite și de scenă (lib/intro-scene.ts), și de dezvăluirea site-ului
 * (components/sections/Intro.tsx), ca să rămână sincronizate. Fișier mic, fără three.js: se poate importa oriunde.
 */

export type IntroColors = { foreground: string; accent: string; background: string };

export type IntroScene = {
  /** Desenează cadrul pentru progresul dat (nu face nimic dacă n-ar avea ce schimba). */
  render: (progress: number, time: number) => void;
  resize: () => void;
  dispose: () => void;
};

/** Ce exportă lib/intro-scene.ts. `null` = fără WebGL. */
export type CreateIntroScene = (canvas: HTMLCanvasElement, colors: IntroColors) => Promise<IntroScene | null>;

export const introTimeline = {
  /** C-ul se rotește din trei-sferturi spre față. */
  assemble: [0, 0.5],
  /** Punctul face un arc peste inel... */
  orbit: [0, 0.45],
  /** ...și intră în deschiderea C-ului. */
  dock: [0.3, 0.5],
  /** Indicația de scroll: inelul ei se umple până aici, apoi indicația dispare. */
  hintOut: [0.38, 0.48],
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

export const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/** Cât de departe e `value` între `from` și `to` (0–1). */
export const range = (value: number, [from, to]: readonly [number, number]) => clamp01((value - from) / (to - from));

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOut = (t: number) => 1 - (1 - t) ** 3;
