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
 * Se ascunde cât timp secțiunea formularului e vizibilă pe ecran.
 * Textele vin prin props din content/site.ts (floatingCta).
 */
export function FloatingCta({ line1, line2, href }: FloatingCtaProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById(href.replace(/^#/, ""));
    if (!target) return;

    // Se ascunde când secțiunea a urcat peste ultimul sfert al ecranului.
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      rootMargin: "0px 0px -25% 0px",
    });
    io.observe(target);
    return () => io.disconnect();
  }, [href]);

  return (
    <ScrollLink
      href={href}
      inert={hidden}
      className={cn(
        "fixed bottom-[2%] left-1/2 z-40 flex w-[calc(100%-24px)] -translate-x-1/2 items-center justify-between gap-4",
        "rounded-pill border border-accent bg-accent/10 py-2 pr-2 pl-5 backdrop-blur-xl",
        "transition-[opacity,translate] duration-base ease-smooth motion-reduce:transition-none",
        "md:bottom-[4%] md:w-auto md:gap-6 md:pl-6",
        hidden && "pointer-events-none translate-y-4 opacity-0",
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
