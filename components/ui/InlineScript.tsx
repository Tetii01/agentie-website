/**
 * Script care rulează imediat ce browserul îl citește, înainte de prima afișare (ex. intro-ul de pe
 * prima pagină). Pe server e `text/javascript`, în browser `text/plain`: la navigarea din site
 * (fără reîncărcare) React nu-l mai rulează și nici nu avertizează. Rețeta din documentația Next.js
 * („Preventing flash before hydration").
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
