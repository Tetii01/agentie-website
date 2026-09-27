import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

/**
 * TEMPORAR (Faza 1): secțiune goală cu id-ul corect, ca ancorele din meniu
 * și CTA-ul plutitor să poată fi testate. Se șterge când sunt gata toate secțiunile.
 */
export function SectionStub({ id, label, tall = false }: { id?: string; label: string; tall?: boolean }) {
  return (
    <section id={id} className="py-section-mobile md:py-section">
      <Container>
        <div
          className={cn(
            "grid place-items-center rounded-card border border-dashed border-border text-sm text-muted",
            tall ? "min-h-[90vh]" : "min-h-[60vh]",
          )}
        >
          {label}
        </div>
      </Container>
    </section>
  );
}
