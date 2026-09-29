import { Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type LanguageSwitchProps = {
  /** Textul scurt de pe buton, ex. „EN". */
  label: string;
  /** Numele limbii, în limba ei (ex. „English"): pentru cititoarele de ecran. */
  name: string;
  /** Prima pagină în cealaltă limbă, ex. „/en". */
  href: string;
  /** Codul limbii spre care duce, ex. „en". */
  lang: string;
  className?: string;
};

/**
 * Butonul de schimbare a limbii, lângă butonul principal din hero.
 * Discret: aceeași înălțime ca butonul principal, dar închis la culoare, cu contur fin
 * (stilul săgeților din Carousel), ca atenția să rămână pe butonul principal.
 */
export function LanguageSwitch({ label, name, href, lang, className }: LanguageSwitchProps) {
  return (
    <Link
      href={href}
      hrefLang={lang}
      lang={lang}
      aria-label={name}
      className={cn("group control-border block shrink-0 rounded-pill p-px", className)}
    >
      <span
        className={cn(
          "flex h-[calc(3rem-2px)] items-center gap-2 rounded-pill bg-control px-4 text-sm font-medium text-muted",
          "transition-colors duration-base ease-smooth group-hover:text-foreground md:h-[calc(4rem-2px)] md:px-5 md:text-base",
        )}
      >
        <Globe aria-hidden className="size-4 md:size-5" strokeWidth={1.75} />
        {label}
      </span>
    </Link>
  );
}
