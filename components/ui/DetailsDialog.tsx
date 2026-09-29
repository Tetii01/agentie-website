"use client";

import { Plus, X } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useLenis } from "./SmoothScroll";

type DetailsDialogProps = {
  /** Eticheta butonului care deschide fereastra, ex. „Detalii despre proiect: X". */
  openLabel: string;
  closeLabel: string;
  /** Id-ul titlului din fereastră (numele ferestrei pentru cititoarele de ecran). */
  titleId: string;
  /** Conținutul ferestrei, randat pe server. */
  children: ReactNode;
};

/** Cercul cu iconiță, în același stil ca săgețile din Carousel. Efectele de hover vin prin `className`. */
function Circle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 place-items-center rounded-full bg-control text-dot-active md:size-10.5",
        "transition-[background-color,color,rotate,scale] duration-base ease-in-out motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Fereastră de detalii pentru un card: tot cardul devine clickabil (butonul acoperă cardul, sub
 * linkurile care au z-20), iar în colțul din dreapta-sus apare un „+". Se închide cu X, cu Escape
 * sau cu click în afara ferestrei. Cât e deschisă, pagina din spate nu se derulează.
 * Părintele trebuie să aibă `relative` (și, ideal, `group` pentru efectele de hover ale cardului).
 */
export function DetailsDialog({ openLabel, closeLabel, titleId, children }: DetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();

  const open = () => {
    dialogRef.current?.showModal();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
  };

  const handleClose = () => {
    lenis?.start();
    document.documentElement.style.overflow = "";
  };

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={openLabel}
        onClick={open}
        className="group/open absolute inset-0 z-10 cursor-pointer rounded-card focus-visible:outline-offset-[-4px]"
      >
        <span aria-hidden className="control-border absolute top-4 right-4 block rounded-pill p-px md:top-7 md:right-7">
          <Circle className="group-hover/open:rotate-90 group-hover/open:bg-dot-active group-hover/open:text-control">
            <Plus className="size-4 md:size-5" />
          </Circle>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        data-lenis-prevent
        onClose={handleClose}
        onClick={(event) => {
          // Click pe fundal (în afara cardului ferestrei) = închide.
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className={cn(
          "m-auto max-h-[calc(100dvh-2rem)] w-[min(52rem,calc(100%-1.5rem))] overflow-y-auto overscroll-contain",
          "border-0 bg-transparent p-0 text-foreground [scrollbar-width:none]",
          "backdrop:bg-background/75 backdrop:backdrop-blur-sm open:animate-dialog-in motion-reduce:animate-none",
        )}
      >
        <div className="card-surface relative rounded-card p-3 md:p-4">
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => dialogRef.current?.close()}
            className="group control-border absolute top-6 right-6 z-10 block cursor-pointer rounded-pill p-px md:top-8 md:right-8"
          >
            <Circle className="group-hover:bg-dot-active group-hover:text-control group-active:scale-[0.94]">
              <X aria-hidden className="size-4 md:size-5" />
            </Circle>
          </button>
          {children}
        </div>
      </dialog>
    </>
  );
}
