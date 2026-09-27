import type Lenis from "lenis";

/** Înălțimea header-ului fix, ca secțiunea țintă să nu ajungă sub el. */
function headerHeight() {
  return document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 0;
}

/**
 * Scroll la secțiunea cu id-ul dat („top" = începutul paginii).
 * Folosește Lenis când e pornit, altfel scroll nativ instant (prefers-reduced-motion).
 * Întoarce false dacă secțiunea nu există pe pagina curentă.
 */
export function scrollToId(id: string, lenis: Lenis | null): boolean {
  if (id === "top") {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0 });
    return true;
  }

  const target = document.getElementById(id);
  if (!target) return false;

  const offset = -headerHeight();
  if (lenis) {
    lenis.scrollTo(target, { offset });
  } else {
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset });
  }
  return true;
}
