import type { SimpleIcon } from "simple-icons";
import { cn } from "@/lib/cn";

type BrandIconProps = {
  icon: SimpleIcon;
  /** Numele pentru cititoarele de ecran. Fără el, iconița e decorativă (aria-hidden). */
  title?: string;
  className?: string;
};

/** Logo de brand din simple-icons, monocrom (culoarea textului curent). */
export function BrandIcon({ icon, title, className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn("fill-current", className)}
    >
      {title && <title>{title}</title>}
      <path d={icon.path} />
    </svg>
  );
}
