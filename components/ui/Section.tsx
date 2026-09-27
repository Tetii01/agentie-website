import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = HTMLAttributes<HTMLElement> & {
  /** Id-ul folosit de ancore (ex. „servicii"). */
  id?: string;
};

/**
 * O secțiune a paginii: spațierea verticală standard (py-section) + Container.
 * Nu pune scroll-mt-* aici: offset-ul pentru header se aplică în lib/scroll.ts.
 */
export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-section-mobile md:py-section", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}
