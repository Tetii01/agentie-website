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
 * Cercul cu săgeată, în stilul săgeților din Carousel: contur în gradient, fundal închis, iar la hover
 * (pe elementul părinte cu clasa `group`) se inversează. Folosit de VisitLink și de cardurile de testimonial.
 */
export function ArrowCircle({ className }: { className?: string }) {
  return (
    <span className={cn("control-border block rounded-pill p-px", className)}>
      <span
        className={cn(
          "grid size-9 place-items-center rounded-full bg-control text-dot-active md:size-10.5",
          "transition-[background-color,color,scale] duration-base ease-in-out motion-reduce:transition-none",
          "group-hover:bg-dot-active group-hover:text-control group-active:scale-[0.94]",
        )}
      >
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-base ease-in-out group-hover:translate-x-px group-hover:-translate-y-px motion-reduce:transition-none md:size-5"
        />
      </span>
    </span>
  );
}

/**
 * Buton rotund cu săgeată spre un site extern (se deschide în tab nou).
 * Dacă `url` nu e încă un link real (placeholder „[URL …]"), cercul apare estompat, fără link.
 */
export function VisitLink({ url, label, newTabLabel, className }: VisitLinkProps) {
  if (!displayDomain(url)) {
    return <ArrowCircle className={cn("opacity-40", className)} />;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} ${newTabLabel}`}
      className={cn("group block rounded-pill", className)}
    >
      <ArrowCircle />
    </a>
  );
}
