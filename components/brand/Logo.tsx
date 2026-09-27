import { brand } from "@/content/site";
import { cn } from "@/lib/cn";

const sizes = {
  /** Header, footer. */
  md: "text-lg",
  /** CTA final. */
  xl: "text-4xl sm:text-5xl md:text-7xl",
  /** Conturul decorativ mare din „Despre". */
  display: "text-[11vw] leading-none lg:text-[8.5rem]",
};

const variants = {
  solid: "text-foreground",
  /** Doar contur, foarte transparent (tokenul --color-logo-outline). */
  outline: "logo-outline",
};

type LogoProps = {
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  className?: string;
};

/**
 * Logo-ul agenției. Deocamdată afișează numele din content/site.ts, ca text.
 *
 * Pentru logo-ul final: înlocuiește <span> cu SVG-ul (inline sau next/image) și păstrează
 * numele brandului ca text accesibil, de ex.:
 *   <svg role="img" aria-label={brand.name} className={…}>…</svg>
 * `size` controlează mărimea în fiecare loc unde apare; `variant="outline"` e varianta
 * de contur din fundalul secțiunii „Despre" (pentru SVG: fill="none" + stroke).
 */
export function Logo({ size = "md", variant = "solid", className }: LogoProps) {
  return (
    <span className={cn("font-bold tracking-tight whitespace-nowrap", sizes[size], variants[variant], className)}>
      {brand.name}
    </span>
  );
}
