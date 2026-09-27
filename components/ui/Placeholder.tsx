import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const aspects = {
  square: "aspect-square",
  video: "aspect-video",
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
};

type PlaceholderProps = {
  /** Eticheta mică afișată în bloc, ex. „Imagine proiect". */
  label: string;
  /** "rounded" = colțuri rotunjite (rounded-card), "circle" = rotund. */
  shape?: "rounded" | "circle";
  aspect?: keyof typeof aspects;
  /** Ascunde eticheta vizibilă (pentru blocuri mici, ex. avatare). Rămâne pentru cititoarele de ecran. */
  compact?: boolean;
  className?: string;
};

/**
 * Bloc provizoriu în locul unei imagini: gradient neutru, colțuri rotunjite, etichetă mică.
 * Se înlocuiește cu next/image când avem conținutul real (vezi README).
 */
export function Placeholder({ label, shape = "rounded", aspect = "landscape", compact = false, className }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex flex-col items-center justify-center gap-3 overflow-hidden border border-border",
        "bg-linear-to-br from-surface-2 via-surface to-background",
        shape === "circle" ? "rounded-full" : "rounded-card",
        aspects[aspect],
        className,
      )}
    >
      <ImageIcon aria-hidden className="size-7 text-muted/50" strokeWidth={1.25} />
      {!compact && (
        <span className="rounded-pill border border-border bg-background/60 px-3 py-1 text-xs text-muted">
          {label}
        </span>
      )}
    </div>
  );
}
