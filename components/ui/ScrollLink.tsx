"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { scrollToId } from "@/lib/scroll";
import { useLenis } from "./SmoothScroll";

type ScrollLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  /** Ancora secțiunii, ex. „#analiza". */
  href: string;
};

/** Prima pagină a limbii curente: „/en" pentru engleză, „/" pentru română. */
const homeFor = (pathname: string) => (pathname === "/en" || pathname.startsWith("/en/") ? "/en" : "/");

/**
 * Link către o secțiune de pe prima pagină (a limbii curente).
 * Pe prima pagină face scroll lin (Lenis) cu offset pentru header;
 * de pe alte pagini (ex. paginile legale) navighează la „/#secțiune" (sau „/en#secțiune").
 * `homeFor` dă același rezultat pe server și în browser, deci linkul nu produce diferențe la hidratare.
 */
export function ScrollLink({ href, onClick, ...props }: ScrollLinkProps) {
  const lenis = useLenis();
  const pathname = usePathname();
  const id = href.replace(/^#/, "");
  const home = homeFor(pathname);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || pathname !== home) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (scrollToId(id, lenis)) event.preventDefault();
  }

  return <Link href={`${home}#${id}`} onClick={handleClick} {...props} />;
}
