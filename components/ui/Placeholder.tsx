import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export const aspects = {
  square: "aspect-square",
  video: "aspect-video",
  landscape: "aspect-[4/3]",
  portrait: "aspect-[3/4]",
};

export const shapes = {
  /** Colțuri rotunjite (rounded-card). */
  rounded: "rounded-card",
  /** Rotund. */
  circle: "rounded-full",
  /** Fără colțuri: umple un container care are deja forma lui (ex. imaginea din cardul de proiect). */
  none: "",
};

export type PlaceholderProps = {
  /** Eticheta mică afișată în bloc, ex. „Imagine proiect". */
  label: string;
  shape?: keyof typeof shapes;
  aspect?: keyof typeof aspects;
  /** Ascunde eticheta și iconița (pentru blocuri mici, ex. avatare). Eticheta rămâne pentru cititoarele de ecran. */
  compact?: boolean;
  className?: string;
};

/**
 * Bloc provizoriu în locul unei imagini: gradient neutru, colțuri rotunjite, etichetă mică.
 * Folosit prin `Media`, care îl înlocuiește automat cu imaginea reală când există (vezi README).
 */
export function Placeholder({ label, shape = "rounded", aspect = "landscape", compact = false, className }: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex flex-col items-center justify-center gap-3 overflow-hidden",
        "bg-linear-to-br from-surface-2 via-surface to-background",
        shape !== "none" && "border border-border",
        shapes[shape],
        aspects[aspect],
        className,
      )}
    >
      {!compact && (
        <>
          <ImageIcon aria-hidden className="size-7 text-muted/50" strokeWidth={1.25} />
          <span className="rounded-pill border border-border bg-background/60 px-3 py-1 text-xs text-muted">
            {label}
          </span>
        </>
      )}
    </div>
  );
}
