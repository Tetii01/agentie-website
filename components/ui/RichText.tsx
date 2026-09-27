/**
 * Afișează un text din content/site.ts în care părțile dintre ** ** sunt îngroșate.
 * Ex.: "Credem că **tehnologia bună** contează" → „Credem că <strong>tehnologia bună</strong> contează".
 */
export function RichText({ text, strongClassName = "font-semibold text-foreground" }: { text: string; strongClassName?: string }) {
  return text.split("**").map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className={strongClassName}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
