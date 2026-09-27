/** Pasul de stagger dintre carduri vecine, în ms. */
const STEP_MS = 80;

/**
 * Întârzierea FadeIn pentru cardul de pe poziția `index`: 0, 80, 160, 240 ms…
 * `perRow` reia secvența de la 0 pe fiecare rând din grid (ex. 3 pentru un grid cu 3 coloane).
 */
export function stagger(index: number, perRow = 4) {
  return (index % perRow) * STEP_MS;
}
