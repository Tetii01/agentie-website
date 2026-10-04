import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Culorile din tokens (app/globals.css), pentru imaginile generate cu next/og
 * (imaginea OG, iconița Apple), care nu pot citi variabile CSS.
 * Se citesc la build, deci urmează automat orice schimbare de culori din globals.css.
 * Doar pe server.
 */
export function themeColors() {
  const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  const token = (name: string, fallback: string) =>
    css.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1].trim() ?? fallback;

  return {
    background: token("background", "#0d0d0d"),
    surface: token("surface", "#141414"),
    foreground: token("foreground", "#ffffff"),
    muted: token("muted", "#909099"),
    accent: token("accent", "#ff3b4e"),
    glow: token("glow", "rgba(255, 255, 255, 0.07)"),
  };
}

/** Fonturile Geist pentru next/og (Satori are nevoie de fișiere TTF, nu de next/font). */
export function ogFonts() {
  const font = (file: string) => readFileSync(join(process.cwd(), "assets/fonts", file));
  return [
    { name: "Geist", data: font("Geist-Bold.ttf"), weight: 700 as const, style: "normal" as const },
    { name: "Geist", data: font("Geist-Medium.ttf"), weight: 500 as const, style: "normal" as const },
  ];
}
