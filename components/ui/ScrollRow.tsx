"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ScrollRowProps = {
  children: ReactNode;
  /** Clase pentru listă de la tabletă în sus (ex. „md:grid-cols-2 lg:grid-cols-3"). */
  gridClassName?: string;
  className?: string;
};

/**
 * Pe mobil (sub md): rând cu derulare orizontală, scroll-snap pe fiecare card și o bară
 * discretă de progres dedesubt. De la tabletă în sus: grid obișnuit.
 * Copiii sunt <li>-uri; fiecare ar trebui să aibă „w-[85%] shrink-0 snap-start md:w-auto".
 * `data-lenis-prevent-horizontal`: gesturile orizontale rămân native, scroll-ul vertical rămâne lin.
 * `data-fade-group`: pe mobil, cardurile (FadeIn) apar odată cu rândul, nu pe rând la glisare.
 */
export function ScrollRow({ children, gridClassName, className }: ScrollRowProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const thumb = thumbRef.current;
    if (!list || !thumb) return;

    let frame = 0;
    // Bara: lățimea = cât din rând se vede, poziția = cât s-a derulat. Scrisă direct în DOM, fără re-render.
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const visible = list.clientWidth / list.scrollWidth;
        const maxScroll = list.scrollWidth - list.clientWidth;
        const progress = maxScroll > 0 ? list.scrollLeft / maxScroll : 0;
        thumb.style.width = `${visible * 100}%`;
        thumb.style.transform = `translateX(${(progress * (1 - visible) * 100) / visible}%)`;
      });
    };

    update();
    list.addEventListener("scroll", update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(list);
    return () => {
      cancelAnimationFrame(frame);
      list.removeEventListener("scroll", update);
      resize.disconnect();
    };
  }, []);

  return (
    <div className={className}>
      <ul
        ref={listRef}
        data-lenis-prevent-horizontal
        data-fade-group
        className={cn(
          "-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-4 overflow-x-auto px-gutter [scrollbar-width:none]",
          "md:mx-0 md:grid md:overflow-visible md:px-0",
          gridClassName,
        )}
      >
        {children}
      </ul>
      <div aria-hidden className="mx-auto mt-6 h-1 w-24 overflow-hidden rounded-pill bg-border md:hidden">
        <span ref={thumbRef} className="block h-full rounded-pill bg-muted" />
      </div>
    </div>
  );
}
