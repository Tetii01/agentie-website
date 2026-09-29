import { Container } from "@/components/ui/Container";
import { LogoLoop } from "@/components/ui/LogoLoop";
import { band } from "@/content/site";

/**
 * Banda dintre „Sună cunoscut?" și „Ce construim": ce construim (iconiță + cuvânt), în gri,
 * trecând încet pe orizontală, cu marginile estompate. Același stil ca banda cu logo-uri din testimoniale.
 * Doar decorativă (aria-hidden): aceleași lucruri sunt scrise în secțiunea de servicii.
 */
export function SolutionsBand() {
  return (
    <Container aria-hidden className="py-8 md:py-12">
      <LogoLoop
        items={band.items.map(({ label, icon: Icon }) => ({
          key: label,
          node: (
            <span className="flex items-center gap-3 text-xl font-medium tracking-tight whitespace-nowrap text-foreground opacity-45 transition-opacity duration-base hover:opacity-100 md:text-2xl">
              <Icon className="size-5 md:size-6" strokeWidth={1.75} />
              {label}
            </span>
          ),
        }))}
      />
    </Container>
  );
}
