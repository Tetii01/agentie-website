"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CarouselLabels = {
  previous: string;
  next: string;
  /** Cu „{page}", ex. „Mergi la pagina {page}". */
  goTo: string;
};

type CarouselProps = {
  /** Elementele <li>. Lățimea lor (câte încap pe o pagină) o dau clasele puse pe fiecare <li>. */
  children: ReactNode;
  labels: CarouselLabels;
  /** Eticheta listei pentru cititoarele de ecran. */
  label?: string;
  /**
   * Un element fix în stânga rândului (ex. cardul cu nota din testimoniale): nu se derulează,
   * iar bulinele și săgețile rămân centrate sub tot blocul. Pe mobil stă deasupra rândului.
   */
  leading?: ReactNode;
  listClassName?: string;
  className?: string;
};

/**
 * Rând derulabil pe orizontală, card cu card: săgețile mută rândul exact un card, iar fiecare
 * bulină e o poziție (un card aliniat la stânga; ultimele carduri se adună în ultima poziție,
 * când rândul ajunge la capăt). Pe mobil se glisează nativ (scroll-snap pe fiecare card).
 * `data-lenis-prevent-horizontal`: gesturile orizontale rămân native, scroll-ul paginii rămâne lin.
 * Stilul controalelor: control-border + bg-control (app/globals.css), bulinele: bg-dot / bg-dot-active.
 */
export function Carousel({ children, labels, label, leading, listClassName, className }: CarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [stops, setStops] = useState<number[]>([0]);
  const [active, setActive] = useState(0);

  /** Pozițiile de scroll la care se poate opri rândul: începutul fiecărui card, până la capătul rândului. */
  const measureStops = useCallback(() => {
    const list = listRef.current;
    if (!list) return [0];
    const maxScroll = list.scrollWidth - list.clientWidth;
    const origin = list.getBoundingClientRect().left - list.scrollLeft;
    const result: number[] = [];
    for (const item of Array.from(list.children)) {
      const position = Math.min(Math.round(item.getBoundingClientRect().left - origin), maxScroll);
      if (result.length === 0 || position - result[result.length - 1] > 2) result.push(Math.max(position, 0));
    }
    return result.length ? result : [0];
  }, []);

  /** Indexul poziției celei mai apropiate de scroll-ul curent. */
  const nearest = useCallback((positions: number[]) => {
    const left = listRef.current?.scrollLeft ?? 0;
    let best = 0;
    positions.forEach((position, index) => {
      if (Math.abs(position - left) < Math.abs(positions[best] - left)) best = index;
    });
    return best;
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const positions = measureStops();
        setStops(positions);
        setActive(nearest(positions));
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
  }, [measureStops, nearest]);

  const goTo = (index: number) => {
    const list = listRef.current;
    if (!list) return;
    const positions = measureStops();
    const target = positions[Math.min(Math.max(index, 0), positions.length - 1)];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // scrollBy, nu scrollTo: în Chrome, scrollTo lin cu scroll-snap uneori rămâne pe loc.
    list.scrollBy({ left: target - list.scrollLeft, behavior: reduce ? "auto" : "smooth" });
  };

  /** Mută rândul cu un card față de poziția curentă (citită din scroll, nu din state). */
  const step = (direction: 1 | -1) => goTo(nearest(measureStops()) + direction);

  const pages = stops.length;

  const list = (
    <ul
      ref={listRef}
      aria-label={label}
      data-lenis-prevent-horizontal
      className={cn(
        "flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        leading !== undefined && "min-w-0 flex-auto",
        listClassName,
      )}
    >
      {children}
    </ul>
  );

  return (
    <div className={className}>
      {leading !== undefined ? (
        <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-4">
          {leading}
          {list}
        </div>
      ) : (
        list
      )}

      <div className={cn("mt-6 flex items-center justify-center gap-3", pages <= 1 && "invisible")}>
        <div className="control-border rounded-pill p-px">
          <div className="flex items-center gap-2 rounded-pill bg-control p-3.5">
            {Array.from({ length: pages }, (_, page) => (
              <button
                key={page}
                type="button"
                aria-label={labels.goTo.replace("{page}", String(page + 1))}
                aria-current={page === active || undefined}
                onClick={() => goTo(page)}
                className={cn(
                  "h-2.5 cursor-pointer rounded-pill transition-all duration-base ease-in-out motion-reduce:transition-none",
                  page === active ? "w-5.5 bg-dot-active" : "w-2.5 bg-dot hover:bg-muted",
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <ArrowButton label={labels.previous} disabled={active === 0} onClick={() => step(-1)}>
            <ChevronLeft aria-hidden className="size-6 scale-120" strokeWidth={1.75} />
          </ArrowButton>
          <ArrowButton label={labels.next} disabled={active >= pages - 1} onClick={() => step(1)}>
            <ChevronRight aria-hidden className="size-6 scale-120" strokeWidth={1.75} />
          </ArrowButton>
        </div>
      </div>
    </div>
  );
}

/** Săgeată rotundă: contur în gradient, fundal închis; la hover se inversează (fundal deschis, săgeată închisă). */
function ArrowButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="group control-border block cursor-pointer rounded-pill p-px transition-opacity duration-base disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
    >
      <span
        className={cn(
          "grid size-9.5 place-items-center rounded-full bg-control text-dot-active",
          "transition-[background-color,color,scale] duration-base ease-in-out motion-reduce:transition-none",
          "group-enabled:group-hover:bg-dot-active group-enabled:group-hover:text-control group-enabled:group-active:scale-[0.94]",
        )}
      >
        {children}
      </span>
    </button>
  );
}
