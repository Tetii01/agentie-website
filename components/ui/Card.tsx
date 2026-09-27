import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  /** Fundal surface cu un gradient foarte discret de sus în jos. */
  default: "bg-surface bg-linear-to-b from-surface-2 to-surface",
  /** Mai discret: doar border, fără fundal plin. */
  subtle: "bg-transparent",
};

const paddings = {
  lg: "p-6 md:p-10",
  /** Pentru carduri înguste (ex. 4 pe rând). */
  md: "p-6 md:p-8",
  /** Mic pe mobil (ex. grid 2×2), generos de la tabletă în sus. */
  tight: "p-4 md:p-10",
  /** Pentru carduri cu imagine sus (imaginea stă aproape de margine). */
  sm: "p-3",
};

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "li";
  variant?: keyof typeof variants;
  padding?: keyof typeof paddings;
};

/** Card cu colțuri mari (rounded-card) și border subtil. */
export function Card({ as: Tag = "div", variant = "default", padding = "lg", className, ...props }: CardProps) {
  return (
    <Tag
      className={cn("rounded-card border border-border", variants[variant], paddings[padding], className)}
      {...props}
    />
  );
}
