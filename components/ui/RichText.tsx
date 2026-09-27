import type { ReactNode } from "react";
import { SmartLink } from "./SmartLink";

/** `**îngroșat**` sau `[text link](adresă)`. */
const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

type RichTextProps = {
  text: string;
  strongClassName?: string;
  linkClassName?: string;
};

/**
 * Afișează un text din content/site.ts în care:
 * - părțile dintre ** ** sunt îngroșate: "Credem că **tehnologia bună** contează";
 * - [text](adresă) devine link: "vezi [Politica de cookies](/politica-de-cookies)".
 */
export function RichText({
  text,
  strongClassName = "font-semibold text-foreground",
  linkClassName = "text-foreground underline underline-offset-4 transition-colors duration-base hover:text-accent",
}: RichTextProps) {
  const nodes: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    if (match[1] !== undefined) {
      nodes.push(
        <strong key={index} className={strongClassName}>
          {match[1]}
        </strong>,
      );
    } else {
      nodes.push(
        <SmartLink key={index} href={match[3]} className={linkClassName}>
          {match[2]}
        </SmartLink>,
      );
    }
    last = index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));

  return nodes;
}
