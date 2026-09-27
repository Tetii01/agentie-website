"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Anul curent, actualizat în browser. Pagina e generată static, așa că serverul
 * trimite anul de la build (`fallback`); în browser se afișează anul real.
 */
export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => fallback,
  );
  return <>{year}</>;
}
