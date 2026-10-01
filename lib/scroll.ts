import type Lenis from "lenis";

/** Înălțimea header-ului fix, ca secțiunea țintă să nu ajungă sub el. */
function headerHeight() {
  return document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 0;
}

/** Unde începe pagina propriu-zisă: după distanța de scroll a intro-ului 3D, dacă e afișat (altfel 0). */
function pageTop() {
  return document.querySelector<HTMLElement>("[data-intro-spacer]")?.offsetHeight ?? 0;
}

/**
 * Scroll la secțiunea cu id-ul dat („top" = începutul paginii, adică hero-ul, după intro).
 * Folosește Lenis când e pornit, altfel scroll nativ instant (prefers-reduced-motion).
 * Întoarce false dacă secțiunea nu există pe pagina curentă.
 */
export function scrollToId(id: string, lenis: Lenis | null): boolean {
  if (id === "top") {
    if (lenis) lenis.scrollTo(pageTop());
    else window.scrollTo({ top: pageTop() });
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
