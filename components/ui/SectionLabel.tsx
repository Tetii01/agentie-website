import type { ReactNode } from "react";

/**
 * Eticheta mică, centrată, de deasupra unei secțiuni. Aceeași pilulă ca bara cu buline din Carousel
 * (contur în gradient, fundal închis, aceeași înălțime), cu un punct în accent.
 * Împreună cu spațiul din jur, face pauza dintre două grid-uri de carduri.
 */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex justify-center md:mb-8">
      <p className="control-border rounded-pill p-px">
        <span className="flex items-center gap-2.5 rounded-pill bg-control px-4.5 py-2.5 text-label font-medium text-foreground">
          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
          {children}
        </span>
      </p>
    </div>
  );
}
