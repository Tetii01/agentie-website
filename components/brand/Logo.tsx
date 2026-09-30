import { brand } from "@/content/site";
import { cn } from "@/lib/cn";
import { logoDot, logoShapes, logoViewBox } from "./logo-shapes";

const sizes = {
  /** Header, footer, CTA final. */
  md: "h-6 md:h-7",
  /** Conturul decorativ mare din „Despre". */
  display: "h-[16vw] lg:h-[9.5rem]",
};

const variants = {
  /** Orbita și literele în culoarea textului, punctul în culoarea de accent. */
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
 * Logo-ul Creos (SVG din Illustrator, formele sunt în ./logo-shapes.ts).
 * Numele din content/site.ts rămâne textul accesibil.
 * `size` controlează înălțimea în fiecare loc unde apare; `variant="outline"` e varianta
 * de contur din fundalul secțiunii „Despre".
 */
export function Logo({ size = "md", variant = "solid", className }: LogoProps) {
  return (
    <svg
      role="img"
      aria-label={brand.name}
      viewBox={`0 0 ${logoViewBox.width} ${logoViewBox.height}`}
      className={cn("block w-auto shrink-0", sizes[size], variants[variant], className)}
    >
      {logoShapes.map((d) => (
        <path key={d} d={d} fill="currentColor" vectorEffect="non-scaling-stroke" />
      ))}
      <circle
        {...logoDot}
        fill="currentColor"
        vectorEffect="non-scaling-stroke"
        className={variant === "solid" ? "text-accent" : undefined}
      />
    </svg>
  );
}
