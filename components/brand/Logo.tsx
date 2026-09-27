import { brand } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Logo-ul agenției. Deocamdată afișează numele din content/site.ts, ca text.
 *
 * Pentru logo-ul final: înlocuiește <span> cu SVG-ul (inline sau next/image)
 * și păstrează numele brandului ca text accesibil, de ex.:
 *   <svg role="img" aria-label={brand.name} className={className}>…</svg>
 * Dimensiunea se controlează din `className` acolo unde e folosit.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("text-lg font-bold tracking-tight whitespace-nowrap text-foreground", className)}>
      {brand.name}
    </span>
  );
}
