import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "li";
};

/** Card cu colțuri mari, border subtil și un gradient foarte discret de sus în jos. */
export function Card({ as: Tag = "div", className, ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-card border border-border bg-surface bg-linear-to-b from-surface-2 to-surface p-6 md:p-10",
        className,
      )}
      {...props}
    />
  );
}
