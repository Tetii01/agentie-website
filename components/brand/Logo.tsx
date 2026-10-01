import { brand } from "@/content/site";
import { cn } from "@/lib/cn";
import { logoDot, logoShapes, logoViewBox, symbolViewBox } from "./logo-shapes";

const variants = {
  /** Orbita și literele în culoarea textului, punctul în culoarea de accent. */
  solid: "text-foreground",
  /** Doar contur, foarte transparent (tokenul --color-logo-outline). */
  outline: "logo-outline",
  /** Tot logo-ul în culoarea de accent (copiile „glitch" din intro). */
  accent: "text-accent",
};

type Variant = keyof typeof variants;

function LogoSvg({
  shapes,
  viewBox,
  variant,
  className,
}: {
  shapes: string[];
  viewBox: { width: number; height: number };
  variant: Variant;
  className: string;
}) {
  return (
    <svg
      role="img"
      aria-label={brand.name}
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      className={cn("block shrink-0", variants[variant], className)}
    >
      {shapes.map((d) => (
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

const logoSizes = {
  /** Header, footer. */
  md: "h-6 w-auto md:h-7",
  /** Intro: cât lățimea elementului părinte. */
  fill: "h-auto w-full",
};

type LogoProps = {
  size?: keyof typeof logoSizes;
  variant?: Variant;
  className?: string;
};

/**
 * Logo-ul Creos: simbolul și textul „creos" (SVG din Illustrator, formele sunt în ./logo-shapes.ts).
 * Numele din content/site.ts rămâne textul accesibil.
 */
export function Logo({ size = "md", variant = "solid", className }: LogoProps) {
  return <LogoSvg shapes={logoShapes} viewBox={logoViewBox} variant={variant} className={cn(logoSizes[size], className)} />;
}

const submarkSizes = {
  /** CTA final. */
  md: "h-10 w-auto md:h-12",
  /** Conturul decorativ mare din „Despre". */
  display: "h-[44vw] w-auto lg:h-[17rem]",
};

type SubmarkProps = {
  size?: keyof typeof submarkSizes;
  variant?: Variant;
  className?: string;
};

/** Submark-ul Creos: doar simbolul (orbita + punctul), fără text. */
export function Submark({ size = "md", variant = "solid", className }: SubmarkProps) {
  return (
    <LogoSvg
      shapes={logoShapes.slice(0, 1)}
      viewBox={symbolViewBox}
      variant={variant}
      className={cn(submarkSizes[size], className)}
    />
  );
}
