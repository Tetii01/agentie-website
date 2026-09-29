import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { displayDomain } from "@/lib/url";

type VisitLinkProps = {
  url: string;
  /** Textul pentru cititoarele de ecran, ex. „Vezi site-ul X". */
  label: string;
  /** Ex. „(se deschide într-un tab nou)" din ui. */
  newTabLabel: string;
  className?: string;
};

/**
 * Buton rotund cu săgeată spre un site extern (se deschide în tab nou), în același stil ca
 * săgețile din Carousel: contur în gradient, fundal închis, iar la hover se inversează.
 * Dacă `url` nu e încă un link real (placeholder „[URL …]"), cercul apare estompat, fără link.
 */
export function VisitLink({ url, label, newTabLabel, className }: VisitLinkProps) {
  const circle = (
    <span
      className={cn(
        "grid size-10.5 place-items-center rounded-full bg-control text-dot-active",
        "transition-[background-color,color,scale] duration-base ease-in-out motion-reduce:transition-none",
        "group-hover:bg-dot-active group-hover:text-control group-active:scale-[0.94]",
      )}
    >
      <ArrowUpRight
        aria-hidden
        className="size-5 transition-transform duration-base ease-in-out group-hover:translate-x-px group-hover:-translate-y-px motion-reduce:transition-none"
      />
    </span>
  );

  if (!displayDomain(url)) {
    return (
      <span aria-hidden className={cn("control-border block rounded-pill p-px opacity-40", className)}>
        {circle}
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} ${newTabLabel}`}
      className={cn("group control-border block rounded-pill p-px", className)}
    >
      {circle}
    </a>
  );
}
