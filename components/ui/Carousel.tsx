"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { durationToken, easingToken } from "@/lib/easing";

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

/**
 * Rând derulabil pe orizontală, card cu card. Săgețile și bulinele mută rândul cu o animație proprie,
 * cu aceeași curbă ca restul site-ului (--ease-smooth) și o durată aproape fixă (--transition-duration-slide):
 * un pas mai lung (cardul lat) durează doar puțin mai mult, ca mișcarea să arate la fel la fiecare pas.
 * Trackpad-ul și degetul derulează nativ, cu scroll-snap pe fiecare card.
 * Fără `loop`, fiecare bulină e o poziție (ultimele carduri se adună în ultima, la capătul rândului);
 * cu `loop`, câte o bulină pentru fiecare card.
 * `data-lenis-prevent-horizontal`: gesturile orizontale rămân native, scroll-ul paginii rămâne lin.
 * Stilul controalelor: control-border + bg-control (app/globals.css), bulinele: bg-dot / bg-dot-active.
 */
export function Carousel({ children, labels, label, leading, loop = false, listClassName, className }: CarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const animationRef = useRef<{ frame: number; targetIndex: number } | null>(null);
  /** Cardul pe care stă rândul (index în toată lista), ca să rămână pe el când se schimbă lățimea. */
  const indexRef = useRef(0);
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

  /** Oprește animația în curs (ex. când utilizatorul pune mâna pe rând) și repune scroll-snap-ul. */
  const stopAnimation = useCallback(() => {
    if (!animationRef.current) return;
    cancelAnimationFrame(animationRef.current.frame);
    animationRef.current = null;
    if (listRef.current) listRef.current.style.scrollSnapType = "";
  }, []);

  /** Animația spre poziția cu indexul dat. Scroll-snap-ul e oprit cât timp rulează, ca să nu tragă de rând. */
  const animateTo = useCallback(
    (targetIndex: number) => {
      const list = listRef.current;
      if (!list) return;
      const positions = measureStops();
      const index = Math.min(Math.max(targetIndex, 0), positions.length - 1);
      const start = list.scrollLeft;
      const distance = positions[index] - start;

      stopAnimation();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || Math.abs(distance) < 1) {
        list.scrollLeft = positions[index];
        recenter();
        return;
      }

      // Durata: tokenul pentru un pas obișnuit, puțin mai mult pentru distanțe mai mari (max. +30%).
      const base = durationToken("--transition-duration-slide", 600);
      const duration = base * (0.85 + 0.3 * Math.min(Math.abs(distance) / list.clientWidth, 1));
      const ease = easingToken("--ease-smooth");
      const startedAt = performance.now();
      list.style.scrollSnapType = "none";

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        list.scrollLeft = start + distance * ease(progress);
        if (progress < 1) {
          animationRef.current = { frame: requestAnimationFrame(tick), targetIndex: index };
        } else {
          animationRef.current = null;
          list.style.scrollSnapType = "";
          recenter();
        }
      };
      animationRef.current = { frame: requestAnimationFrame(tick), targetIndex: index };
    },
    [measureStops, recenter, stopAnimation],
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
  // La o schimbare de lățime (fereastră, telefon întors), cardurile își schimbă mărimea: rândul
  // revine instant pe cardul pe care era, ca să nu rămână între două carduri.
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
        indexRef.current = index;
        setPages(Math.max(1, count));
        setActive(loop ? index % count : index);
      });
    };

    let firstResize = true;
    const onResize = () => {
      if (firstResize) {
        firstResize = false;
      } else if (!animationRef.current) {
        const positions = measureStops();
        list.scrollLeft = positions[Math.min(indexRef.current, positions.length - 1)];
      }
      update();
    };

    update();
    list.addEventListener("scroll", update, { passive: true });
    const resize = new ResizeObserver(onResize);
    resize.observe(list);
    return () => {
      cancelAnimationFrame(frame);
      list.removeEventListener("scroll", update);
      resize.disconnect();
    };
  }, [measureStops, nearest, loop]);

  // Loop: pornește de la primul card din copia din mijloc (înainte de primul cadru desenat).
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!loop || !list) return;
    const items = itemPositions();
    indexRef.current = items.length / 3;
    list.scrollLeft = items[indexRef.current] ?? 0;
  }, [loop, itemPositions]);

  // Derulare nativă (trackpad, deget): când scroll-ul s-a oprit de tot (inclusiv snap-ul),
  // rândul revine în copia din mijloc. Orice atingere oprește animația săgeților, ca să nu se certe.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let timer = 0;
    const settled = () => {
      if (!animationRef.current) recenter();
    };
    // „scrollend" nu apare în toate browserele (și nici la orice fel de scroll), așa că se folosește
    // și o pauză de 200 ms fără scroll. Oricare vine prima; revenirea e fără efect dacă e deja în mijloc.
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settled, 200);
    };
    const takeOver = () => stopAnimation();

    if (loop) {
      list.addEventListener("scrollend", settled);
      list.addEventListener("scroll", onScroll, { passive: true });
    }
    list.addEventListener("wheel", takeOver, { passive: true });
    list.addEventListener("pointerdown", takeOver, { passive: true });
    list.addEventListener("touchstart", takeOver, { passive: true });
    return () => {
      window.clearTimeout(timer);
      list.removeEventListener("scrollend", settled);
      list.removeEventListener("scroll", onScroll);
      list.removeEventListener("wheel", takeOver);
      list.removeEventListener("pointerdown", takeOver);
      list.removeEventListener("touchstart", takeOver);
    };
  }, [loop, recenter, stopAnimation]);

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
