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
 * Rând derulabil pe orizontală, pe pagini: o „pagină" = lățimea vizibilă a rândului.
 * Pe mobil se glisează nativ (scroll-snap); săgețile și bulinele mută rândul o pagină.
 * `data-lenis-prevent-horizontal`: gesturile orizontale rămân native, scroll-ul paginii rămâne lin.
 * Stilul controalelor: control-border + bg-control (app/globals.css), bulinele: bg-dot / bg-dot-active.
 */
export function Carousel({ children, labels, label, leading, listClassName, className }: CarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [pages, setPages] = useState(1);
  const [active, setActive] = useState(0);

  const metrics = useCallback(() => {
    const list = listRef.current;
    if (!list) return null;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const step = list.clientWidth + gap;
    const maxScroll = list.scrollWidth - list.clientWidth;
    return { list, step, maxScroll, gap };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const m = metrics();
        if (!m) return;
        const total = Math.max(1, Math.ceil((m.list.scrollWidth + m.gap) / m.step - 0.01));
        const current = m.list.scrollLeft >= m.maxScroll - 2 ? total - 1 : Math.round(m.list.scrollLeft / m.step);
        setPages(total);
        setActive(Math.min(current, total - 1));
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
  }, [metrics]);

  /** Pagina curentă, citită direct din poziția rândului (nu din state, care se actualizează un cadru mai târziu). */
  const currentPage = () => {
    const m = metrics();
    if (!m) return 0;
    return m.list.scrollLeft >= m.maxScroll - 2 ? pages - 1 : Math.round(m.list.scrollLeft / m.step);
  };

  const goTo = (page: number) => {
    const m = metrics();
    if (!m) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = Math.min(Math.max(page, 0) * m.step, m.maxScroll);
    // scrollBy, nu scrollTo: în Chrome, scrollTo lin cu scroll-snap uneori rămâne pe loc.
    m.list.scrollBy({ left: target - m.list.scrollLeft, behavior: reduce ? "auto" : "smooth" });
  };

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
          <ArrowButton label={labels.previous} disabled={active === 0} onClick={() => goTo(currentPage() - 1)}>
            <ChevronLeft aria-hidden className="size-6 scale-120" strokeWidth={1.75} />
          </ArrowButton>
          <ArrowButton label={labels.next} disabled={active >= pages - 1} onClick={() => goTo(currentPage() + 1)}>
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
