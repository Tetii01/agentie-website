import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { FadeIn } from "./FadeIn";
import { SectionLabel } from "./SectionLabel";

type SectionProps = HTMLAttributes<HTMLElement> & {
  /** Id-ul folosit de ancore (ex. „servicii"). */
  id?: string;
  /** Eticheta mică, centrată, de deasupra conținutului (SectionLabel). */
  label?: ReactNode;
};

/**
 * O secțiune a paginii: spațierea verticală standard (py-section) + Container,
 * opțional cu eticheta de deasupra.
 * Nu pune scroll-mt-* aici: offset-ul pentru header se aplică în lib/scroll.ts.
 */
export function Section({ className, children, label, ...props }: SectionProps) {
  return (
    <section className={cn("py-section-mobile md:py-section", className)} {...props}>
      <Container>
        {label && (
          <FadeIn>
            <SectionLabel>{label}</SectionLabel>
          </FadeIn>
        )}
        {children}
      </Container>
    </section>
  );
}
