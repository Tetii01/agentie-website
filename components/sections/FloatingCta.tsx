"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { cn } from "@/lib/cn";

type FloatingCtaProps = {
  line1: string;
  line2: string;
  /** Ancora formularului, ex. „#analiza". */
  href: string;
};

/**
 * Pilulă fixată jos pe centru care duce la formularul de analiză.
 * Apare abia după ce restul paginii a acoperit hero-ul (marcajul `data-floating-cta-trigger` de la
 * începutul „cortinei", în app/[lang]/page.tsx, trece de header), și se ascunde cât timp secțiunea
 * formularului e vizibilă. Stil liquid metal, ca butoanele principale.
 * Apariția folosește aceeași durată și același easing ca fade-in-ul (duration-fade, ease-fade).
 * Textele vin prin props din content/site.ts (floatingCta).
 */
export function FloatingCta({ line1, line2, href }: FloatingCtaProps) {
  const [pastHero, setPastHero] = useState(false);
  const [offerVisible, setOfferVisible] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const trigger = document.querySelector("[data-floating-cta-trigger]");
    if (trigger) {
      // „A ieșit din ecran" = marcajul de la începutul cortinei a trecut pe sus de header.
      const headerHeight = document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 0;
      const io = new IntersectionObserver(
        ([entry]) =>
          setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0)),
        { rootMargin: `-${headerHeight}px 0px 0px 0px` },
      );
      io.observe(trigger);
      observers.push(io);
    }

    const offer = document.getElementById(href.replace(/^#/, ""));
    if (offer) {
      // Se ascunde când secțiunea a urcat peste ultimul sfert al ecranului.
      const io = new IntersectionObserver(([entry]) => setOfferVisible(entry.isIntersecting), {
        rootMargin: "0px 0px -25% 0px",
      });
      io.observe(offer);
      observers.push(io);
    }

    return () => observers.forEach((io) => io.disconnect());
  }, [href]);

  const hidden = !pastHero || offerVisible;

  return (
    <ScrollLink
      href={href}
      inert={hidden}
      className={cn(
        "fixed bottom-[2%] left-1/2 z-40 flex w-[calc(100%-24px)] -translate-x-1/2 items-center justify-between gap-4",
        "liquid-metal rounded-pill py-2 pr-2 pl-5",
        "transition-[opacity,translate] duration-fade ease-fade motion-reduce:transition-none",
        "md:bottom-[4%] md:w-auto md:gap-6 md:pl-6",
        hidden && "pointer-events-none translate-y-5 opacity-0",
      )}
    >
      <span className="flex flex-col text-left text-sm leading-snug font-medium">
        <span className="text-foreground">{line1}</span>
        <span className="text-accent">{line2}</span>
      </span>
      <span
        aria-hidden
        className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground"
      >
        <ArrowRight className="size-5" />
      </span>
    </ScrollLink>
  );
}
