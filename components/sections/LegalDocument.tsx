import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { legal, type LegalBlock, type LegalDocument as LegalDocumentData } from "@/content/site";

/** Pagină legală: layout simplu, text lizibil (max-w-legal ≈ 720px), același header și footer. */
export function LegalDocument({ doc }: { doc: LegalDocumentData }) {
  return (
    <article className="pt-32 pb-section-mobile md:pt-44 md:pb-section">
      <Container>
        <div className="mx-auto max-w-legal">
          <h1 className="text-h2-mobile font-bold text-balance md:text-h2 text-metal">{doc.title}</h1>
          <p className="mt-4 text-sm text-muted">
            {legal.updatedLabel} {doc.updated}
          </p>

          <div className="mt-10">
            <Blocks blocks={doc.intro} />
          </div>

          {doc.sections.map((section, index) => (
            <section key={section.title} className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight text-balance md:text-2xl">
                {index + 1}. {section.title}
              </h2>
              <div className="mt-4">
                <Blocks blocks={section.body} />
              </div>
            </section>
          ))}
        </div>
      </Container>
    </article>
  );
}

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <div className="flex flex-col gap-4 text-base leading-relaxed text-pretty text-muted md:text-lg">
      {blocks.map((block, index) =>
        typeof block === "string" ? (
          <p key={index}>
            <RichText text={block} />
          </p>
        ) : (
          <ul key={index} className="flex list-disc flex-col gap-2 pl-5 marker:text-muted">
            {block.map((item) => (
              <li key={item}>
                <RichText text={item} />
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}
