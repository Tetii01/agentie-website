import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Etichetă mică tip pilulă, pentru categorii. */
export function Tag({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border border-border bg-surface-2 px-3 py-1 text-xs text-muted md:text-sm",
        className,
      )}
      {...props}
    />
  );
}
