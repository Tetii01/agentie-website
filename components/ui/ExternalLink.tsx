import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { displayDomain } from "@/lib/url";

type ExternalLinkProps = {
  url: string;
  /** Text pentru cititoarele de ecran, ex. „(se deschide într-un tab nou)" din ui. */
  newTabLabel: string;
  className?: string;
};

/**
 * Domeniul unui link extern + săgeată, deschis în tab nou.
 * Dacă `url` nu e încă un link real (placeholder „[URL …]"), se afișează doar textul, fără link.
 */
export function ExternalLink({ url, newTabLabel, className }: ExternalLinkProps) {
  const domain = displayDomain(url);
  const classes = cn("inline-flex items-center gap-1 text-sm text-muted", className);

  if (!domain) return <span className={classes}>{url}</span>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(classes, "transition-colors duration-base hover:text-foreground")}
    >
      {domain}
      <ArrowUpRight aria-hidden className="size-4" />
      <span className="sr-only">{newTabLabel}</span>
    </a>
  );
}
