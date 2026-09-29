"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
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
  /**
   * Buclă: după ultimul card urmează iar primul, fără capăt. Componenta părinte pune lista de
   * 3 ori în `children` (copia din mijloc e cea reală; copiile 1 și 3 cu aria-hidden + inert și
   * id-uri diferite). Rândul stă mereu în copia din mijloc: când ajunge într-o copie de margine,
   * sare instant la același card din mijloc, deci saltul nu se vede.
   */
  loop?: boolean;
  listClassName?: string;
  className?: string;
};

/** Viteza animației: aceeași pe pixel, deci un card lat durează mai mult decât unul îngust și mișcarea arată uniform. */
const MS_PER_PX = 1.1;
const MIN_DURATION = 380;
const MAX_DURATION = 1100;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Rând derulabil pe orizontală, card cu card. Săgețile, bulinele și scroll-ul orizontal de pe
 * trackpad mută rândul exact un card, cu o animație proprie la viteză constantă.
 * Fără `loop`, fiecare bulină e o poziție (ultimele carduri se adună în ultima, la capătul rândului);
 * cu `loop`, câte o bulină pentru fiecare card.
 * Pe mobil se glisează nativ (scroll-snap pe fiecare card).
 * `data-lenis-prevent-horizontal`: gesturile orizontale rămân native, scroll-ul paginii rămâne lin.
 * Stilul controalelor: control-border + bg-control (app/globals.css), bulinele: bg-dot / bg-dot-active.
 */
export function Carousel({ children, labels, label, leading, loop = false, listClassName, className }: CarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const animationRef = useRef<{ frame: number; targetIndex: number } | null>(null);
  const [pages, setPages] = useState(1);
  const [active, setActive] = useState(0);

  /** Poziția de scroll la care fiecare card stă lipit de marginea din stânga. */
  const itemPositions = useCallback(() => {
    const list = listRef.current;
    if (!list) return [];
    const origin = list.getBoundingClientRect().left - list.scrollLeft;
    return Array.from(list.children, (item) => Math.round(item.getBoundingClientRect().left - origin));
  }, []);

  /** Pozițiile la care se poate opri rândul. Fără loop, cele de după capătul rândului se adună în ultima. */
  const measureStops = useCallback(() => {
    const list = listRef.current;
    if (!list) return [0];
    const items = itemPositions();
    if (loop) return items.length ? items : [0];
    const maxScroll = list.scrollWidth - list.clientWidth;
    const result: number[] = [];
    for (const item of items) {
      const position = Math.max(0, Math.min(item, maxScroll));
      if (result.length === 0 || position - result[result.length - 1] > 2) result.push(position);
    }
    return result.length ? result : [0];
  }, [itemPositions, loop]);

  /** Indexul poziției celei mai apropiate de scroll-ul curent. */
  const nearest = useCallback((positions: number[]) => {
    const left = listRef.current?.scrollLeft ?? 0;
    let best = 0;
    positions.forEach((position, index) => {
      if (Math.abs(position - left) < Math.abs(positions[best] - left)) best = index;
    });
    return best;
  }, []);

  /** Loop: dacă rândul e într-o copie de margine, sare instant la același card din copia din mijloc. */
  const recenter = useCallback(() => {
    const list = listRef.current;
    if (!list || !loop) return;
    const items = itemPositions();
    const copyWidth = items[items.length / 3] - items[0];
    if (!copyWidth) return;
    if (list.scrollLeft < copyWidth - 2) list.scrollLeft += copyWidth;
    else if (list.scrollLeft >= 2 * copyWidth - 2) list.scrollLeft -= copyWidth;
  }, [itemPositions, loop]);

  /** Animația spre poziția cu indexul dat: viteză constantă, fără scroll-snap cât timp rulează. */
  const animateTo = useCallback(
    (targetIndex: number) => {
      const list = listRef.current;
      if (!list) return;
      const positions = measureStops();
      const index = Math.min(Math.max(targetIndex, 0), positions.length - 1);
      const start = list.scrollLeft;
      const distance = positions[index] - start;

      if (animationRef.current) cancelAnimationFrame(animationRef.current.frame);
      const finish = () => {
        animationRef.current = null;
        list.style.scrollSnapType = "";
        recenter();
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || Math.abs(distance) < 1) {
        list.scrollLeft = positions[index];
        finish();
        return;
      }

      const duration = Math.min(Math.max(Math.abs(distance) * MS_PER_PX, MIN_DURATION), MAX_DURATION);
      const startedAt = performance.now();
      list.style.scrollSnapType = "none";
      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        list.scrollLeft = start + distance * easeInOutCubic(progress);
        if (progress < 1) animationRef.current = { frame: requestAnimationFrame(tick), targetIndex: index };
        else finish();
      };
      animationRef.current = { frame: requestAnimationFrame(tick), targetIndex: index };
    },
    [measureStops, recenter],
  );

  /** Mută rândul cu un card. Dacă o animație e în curs, pornește de la cardul spre care merge ea. */
  const step = useCallback(
    (direction: 1 | -1) => {
      const from = animationRef.current?.targetIndex ?? nearest(measureStops());
      animateTo(from + direction);
    },
    [animateTo, measureStops, nearest],
  );

  /** Bulina `page`: cu loop, cardul respectiv din copia din mijloc. */
  const goTo = (page: number) => animateTo(loop ? pages + page : page);

  // Bulina activă + numărul de buline, la orice scroll sau redimensionare.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const positions = measureStops();
        const index = nearest(positions);
        const count = loop ? positions.length / 3 : positions.length;
        setPages(Math.max(1, count));
        setActive(loop ? index % count : index);
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
  }, [measureStops, nearest, loop]);

  // Loop: pornește de la primul card din copia din mijloc (înainte de primul cadru desenat), apoi,
  // după fiecare glisare nativă (pe mobil), revine în copia din mijloc, lipit de un card.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || !loop) return;
    const items = itemPositions();
    list.scrollLeft = items[items.length / 3] ?? 0;

    let timer = 0;
    const settle = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (animationRef.current) return;
        recenter();
        const positions = measureStops();
        const position = positions[nearest(positions)];
        if (Math.abs(position - list.scrollLeft) > 2) list.scrollLeft = position;
      }, 150);
    };
    list.addEventListener("scroll", settle, { passive: true });
    return () => {
      window.clearTimeout(timer);
      list.removeEventListener("scroll", settle);
    };
  }, [loop, recenter, itemPositions, measureStops, nearest]);

  // Scroll orizontal pe trackpad: un gest = un card, cu aceeași animație ca săgețile.
  // Scroll-ul vertical trece mai departe la pagină.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let accumulated = 0;
    let locked = false;
    let lastEvent = 0;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const now = performance.now();
      // O pauză între evenimente = gestul (inclusiv inerția) s-a terminat.
      if (now - lastEvent > 220) {
        locked = false;
        accumulated = 0;
      }
      lastEvent = now;
      if (locked) return;
      accumulated += event.deltaX;
      if (Math.abs(accumulated) > 24) {
        step(accumulated > 0 ? 1 : -1);
        locked = true;
      }
    };
    list.addEventListener("wheel", onWheel, { passive: false });
    return () => list.removeEventListener("wheel", onWheel);
  }, [step]);

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
          <ArrowButton label={labels.previous} disabled={!loop && active === 0} onClick={() => step(-1)}>
            <ChevronLeft aria-hidden className="size-6 scale-120" strokeWidth={1.75} />
          </ArrowButton>
          <ArrowButton label={labels.next} disabled={!loop && active >= pages - 1} onClick={() => step(1)}>
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
