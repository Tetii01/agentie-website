"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { routes } from "@/lib/routes";
import { scrollToId } from "@/lib/scroll";
import { useLenis } from "./SmoothScroll";

type ScrollLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  /** Ancora secțiunii, ex. „#analiza". */
  href: string;
};

/**
 * Link către o secțiune de pe prima pagină.
 * Pe prima pagină face scroll lin (Lenis) cu offset pentru header;
 * de pe alte pagini (ex. paginile legale) navighează la „/#secțiune".
 */
export function ScrollLink({ href, onClick, ...props }: ScrollLinkProps) {
  const lenis = useLenis();
  const pathname = usePathname();
  const id = href.replace(/^#/, "");

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || pathname !== routes.home) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (scrollToId(id, lenis)) event.preventDefault();
  }

  return <Link href={`${routes.home}#${id}`} onClick={handleClick} {...props} />;
}
