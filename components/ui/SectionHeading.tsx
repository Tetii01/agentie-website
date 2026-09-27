import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FadeIn } from "./FadeIn";

/** Etichetă mică deasupra unui titlu sau a unui bloc. */
export function Eyebrow({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm font-medium text-muted", className)} {...props} />;
}

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  /** Id pe titlu, pentru aria-labelledby pe secțiune. */
  titleId?: string;
  className?: string;
};

/** Eticheta + H2 + subtitlul unei secțiuni, fiecare cu fade-in în stagger. */
export function SectionHeading({ eyebrow, title, subtitle, align = "center", titleId, className }: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn("flex flex-col gap-4", centered ? "items-center text-center" : "items-start text-left", className)}>
      {eyebrow && (
        <FadeIn>
          <Eyebrow>{eyebrow}</Eyebrow>
        </FadeIn>
      )}
      <FadeIn delay={eyebrow ? 80 : 0}>
        <h2 id={titleId} className="text-h2-mobile font-bold text-balance md:text-h2">
          {title}
        </h2>
      </FadeIn>
      {subtitle && (
        <FadeIn delay={eyebrow ? 160 : 80}>
          <p className="max-w-narrow text-base text-pretty text-muted md:text-lg">{subtitle}</p>
        </FadeIn>
      )}
    </div>
  );
}
