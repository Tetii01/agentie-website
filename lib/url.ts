/**
 * Domeniul afișat pentru un link extern: "https://www.firma.ro/pagina" → "firma.ro".
 * Întoarce null dacă nu e un URL http(s) valid (ex. placeholder „[URL PROIECT]").
 */
export function displayDomain(url: string): string | null {
  if (!/^https?:\/\//.test(url)) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
