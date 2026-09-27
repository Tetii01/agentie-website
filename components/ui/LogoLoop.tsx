import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type LogoLoopProps = {
  items: { key: string; node: ReactNode }[];
  /** Durata unei bucle complete, în secunde (mai mare = mai lent). Implicit: tokenul --animate-marquee. */
  duration?: number;
  /** Eticheta listei pentru cititoarele de ecran. */
  label?: string;
  className?: string;
};

/**
 * Bandă orizontală infinită (marquee), doar CSS: translate3d, viteză constantă,
 * pauză la hover, fade pe margini. Conținutul e dublat ca bucla să fie continuă.
 * La prefers-reduced-motion stă pe loc (vezi app/globals.css).
 */
export function LogoLoop({ items, duration, label, className }: LogoLoopProps) {
  return (
    <div className={cn("marquee", className)}>
      <div
        className="marquee-track animate-marquee"
        style={duration ? { animationDuration: `${duration}s` } : undefined}
      >
        {[0, 1].map((copy) => {
          const isDuplicate = copy === 1;
          return (
            <ul
              key={copy}
              className="marquee-group"
              aria-label={isDuplicate ? undefined : label}
              aria-hidden={isDuplicate || undefined}
              inert={isDuplicate}
            >
              {items.map((item) => (
                <li key={item.key} className="flex shrink-0 items-center">
                  {item.node}
                </li>
              ))}
            </ul>
          );
        })}
      </div>
    </div>
  );
}
