/**
 * Curbele de animație din tokens (app/globals.css), pentru animațiile făcute din JavaScript
 * (ex. pasul din Carousel), ca să se miște la fel ca tranzițiile din CSS.
 * Doar în browser.
 */

/** Funcția de easing pentru un `cubic-bezier(x1, y1, x2, y2)`: primește progresul timpului (0–1), întoarce progresul mișcării. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const bezier = (t: number, a: number, b: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3;
  const slope = (t: number, a: number, b: number) => 3 * a * (1 - t) ** 2 + 6 * (b - a) * t * (1 - t) + 3 * (1 - b) * t ** 2;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    // Găsește t pentru care curba ajunge la x (Newton), apoi întoarce y în acel punct.
    let t = x;
    for (let i = 0; i < 8; i++) {
      const error = bezier(t, x1, x2) - x;
      const d = slope(t, x1, x2);
      if (Math.abs(error) < 1e-5 || d === 0) break;
      t -= error / d;
    }
    return bezier(Math.min(Math.max(t, 0), 1), y1, y2);
  };
}

/** Citește un token de easing (ex. „--ease-smooth") ca funcție; dacă lipsește, folosește curba de rezervă. */
export function easingToken(name: string, fallback: [number, number, number, number] = [0.4, 0, 0.2, 1]) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name);
  const numbers = value.match(/-?[\d.]+/g)?.map(Number);
  const [x1, y1, x2, y2] = numbers?.length === 4 ? numbers : fallback;
  return cubicBezier(x1, y1, x2, y2);
}

/** Citește un token de durată (ex. „--transition-duration-slide: 600ms") în milisecunde. */
export function durationToken(name: string, fallback: number) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const ms = value.endsWith("ms") ? parseFloat(value) : value.endsWith("s") ? parseFloat(value) * 1000 : NaN;
  return Number.isFinite(ms) ? ms : fallback;
}
