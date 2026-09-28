import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  /** Contur în gradient + fundal în gradient (utilitatea card-surface din app/globals.css). */
  default: "card-surface",
  /** Mai discret: doar border, fără fundal plin. */
  subtle: "border border-border bg-transparent",
};

const paddings = {
  lg: "p-6 md:p-10",
  /** Pentru carduri înguste (ex. 4 pe rând). */
  md: "p-6 md:p-8",
  /** Mic pe mobil (ex. grid 2×2), generos de la tabletă în sus. */
  tight: "p-4 md:p-10",
  /** Pentru carduri cu imagine sus (imaginea stă aproape de margine). */
  sm: "p-3",
  /** Fără padding (ex. cardurile de proiect, unde imaginea umple tot cardul). */
  none: "",
};

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "li";
  variant?: keyof typeof variants;
  padding?: keyof typeof paddings;
};

/** Card cu colțuri mari (rounded-card), contur și fundal în gradient. */
export function Card({ as: Tag = "div", variant = "default", padding = "lg", className, ...props }: CardProps) {
  return (
    <Tag
      className={cn("rounded-card", variants[variant], paddings[padding], className)}
      {...props}
    />
  );
}
