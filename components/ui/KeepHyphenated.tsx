/**
 * Afișează textul cu fiecare cuvânt cu cratimă („AI-ul", „ce-ți") ținut pe un singur rând,
 * ca titlurile mari să nu se rupă în „AI-" / „ul" pe ecrane înguste.
 */
export function KeepHyphenated({ text }: { text: string }) {
  // Cu grup de captură, split păstrează cuvintele găsite pe pozițiile impare.
  return text.split(/(\S*-\S*)/).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
