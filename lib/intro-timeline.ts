/**
 * Momentele intro-ului 3D, ca progres al scroll-ului (0 = începutul paginii, 1 = finalul distanței
 * --spacing-intro). Folosite și de scenă (lib/intro-scene.ts), și de dezvăluirea site-ului
 * (components/sections/Intro.tsx), ca să rămână sincronizate. Fișier mic, fără three.js.
 */
export const introTimeline = {
  /** C-ul se rotește din trei-sferturi spre față. */
  assemble: [0, 0.6],
  /** Punctul face o spirală în jurul inelului... */
  orbit: [0, 0.55],
  /** ...și intră în deschiderea C-ului. */
  dock: [0.4, 0.6],
  /** Lumina din spatele logo-ului se stinge când logo-ul e complet. */
  glowOut: [0.5, 0.6],
  /** De aici, fundalul e desenat în scenă, cu o deschidere rotundă în mijlocul C-ului. */
  portal: 0.6,
  /** Deschiderea crește și arată site-ul din spate. */
  iris: [0.6, 0.68],
  /** Camera zboară prin deschidere. */
  zoom: [0.64, 0.9],
  /** Hero-ul crește la mărimea lui în timp ce camera se apropie. */
  heroScale: [0.64, 0.88],
  /** Scena dispare după ce deschiderea a acoperit tot ecranul. */
  sceneOut: [0.84, 0.9],
  /** Header-ul revine și site-ul primește click-uri. */
  done: 0.85,
  /** Dacă scena 3D nu s-a încărcat încă: fundalul doar se estompează. */
  fallbackReveal: [0.66, 0.86],
  /** Indicația „Derulează" dispare la primul scroll. */
  hint: [0, 0.06],
} as const;

export const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/** Cât de departe e `value` între `from` și `to` (0–1). */
export const range = (value: number, [from, to]: readonly [number, number]) => clamp01((value - from) / (to - from));

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOut = (t: number) => 1 - (1 - t) ** 3;
