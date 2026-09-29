import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = HTMLAttributes<HTMLElement> & {
  /** Id-ul folosit de ancore (ex. „servicii"). */
  id?: string;
  /**
   * `wide`: distanța de la secțiunea de deasupra devine --spacing-section-gap (în loc de 2 × --spacing-section).
   * Folosit de la testimoniale în jos, ca grid-urile de carduri să respire.
   */
  spacing?: "default" | "wide";
};

/**
 * O secțiune a paginii: spațierea verticală standard (--spacing-section sus și jos) + Container.
 * Nu pune scroll-mt-* aici: offset-ul pentru header se aplică în lib/scroll.ts.
 */
export function Section({ className, children, spacing = "default", ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "pb-section-mobile md:pb-section",
        spacing === "wide"
          ? "pt-[calc(var(--spacing-section-gap-mobile)-var(--spacing-section-mobile))] md:pt-[calc(var(--spacing-section-gap)-var(--spacing-section))]"
          : "pt-section-mobile md:pt-section",
        className,
      )}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}
