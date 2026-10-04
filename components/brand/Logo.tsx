import { brand } from "@/content/site";
import { cn } from "@/lib/cn";
import { logoSymbolShapes, logoViewBox, logoWordmarkShapes, symbolShapes, symbolViewBox } from "./logo-shapes";

const variants = {
  /** Simbolul în culoarea de accent, textul „creos" în culoarea textului (varianta principală). */
  solid: "text-foreground",
  /** Doar contur, foarte transparent (tokenul --color-logo-outline). */
  outline: "logo-outline",
  /** Tot logo-ul în culoarea de accent (copiile „glitch" din intro). */
  accent: "text-accent",
};

type Variant = keyof typeof variants;

function LogoSvg({
  symbol,
  text = [],
  viewBox,
  variant,
  className,
}: {
  symbol: string[];
  text?: string[];
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
      {text.map((d) => (
        <path key={d} d={d} fill="currentColor" vectorEffect="non-scaling-stroke" />
      ))}
      {symbol.map((d) => (
        <path
          key={d}
          d={d}
          fill="currentColor"
          vectorEffect="non-scaling-stroke"
          className={variant === "solid" ? "text-accent" : undefined}
        />
      ))}
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
 * Logo-ul Creos: simbolul („bucla", în accent) și textul „creos" (formele din brand kit sunt în ./logo-shapes.ts).
 * Numele din content/site.ts rămâne textul accesibil.
 */
export function Logo({ size = "md", variant = "solid", className }: LogoProps) {
  return (
    <LogoSvg
      symbol={logoSymbolShapes}
      text={logoWordmarkShapes}
      viewBox={logoViewBox}
      variant={variant}
      className={cn(logoSizes[size], className)}
    />
  );
}

const submarkSizes = {
  /** CTA final. */
  md: "h-10 w-auto md:h-12",
  /** Conturul decorativ mare. */
  display: "h-[44vw] w-auto lg:h-[17rem]",
};

type SubmarkProps = {
  size?: keyof typeof submarkSizes;
  variant?: Variant;
  className?: string;
};

/** Submark-ul Creos: doar simbolul (inelul și săgeata), fără text. */
export function Submark({ size = "md", variant = "solid", className }: SubmarkProps) {
  return (
    <LogoSvg symbol={symbolShapes} viewBox={symbolViewBox} variant={variant} className={cn(submarkSizes[size], className)} />
  );
}
