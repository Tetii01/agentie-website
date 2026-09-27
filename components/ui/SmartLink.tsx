import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { ScrollLink } from "./ScrollLink";

export type SmartLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string };

/**
 * Link care își alege singur comportamentul după href:
 * - „#secțiune"          → scroll lin la secțiune (ScrollLink)
 * - „https://…"          → link extern, în tab nou
 * - „/ruta"              → navigare internă Next.js
 * - „mailto:", „tel:"…   → link simplu
 */
export function SmartLink({ href, ...props }: SmartLinkProps) {
  if (href.startsWith("#")) return <ScrollLink href={href} {...props} />;
  if (/^https?:\/\//.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  if (href.startsWith("/")) return <Link href={href} {...props} />;
  return <a href={href} {...props} />;
}
