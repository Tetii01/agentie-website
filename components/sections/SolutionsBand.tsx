import { Sparkle } from "lucide-react";
import { LogoLoop } from "@/components/ui/LogoLoop";
import { band } from "@/content/site";

/**
 * Banda dintre „Sună cunoscut?" și „Ce construim": o fâșie în culoarea de accent, ușor înclinată,
 * pe toată lățimea ecranului, cu ce construim trecând încet pe orizontală.
 * Desparte cele două grid-uri de carduri și marchează trecerea de la probleme la soluții.
 * Doar decorativă (aria-hidden): aceleași lucruri sunt scrise în secțiunea de servicii.
 */
export function SolutionsBand() {
  return (
    <div aria-hidden className="overflow-x-clip py-10 md:py-16">
      <div className="-mx-[5vw] -rotate-2 bg-accent py-3 text-accent-foreground md:py-5">
        <LogoLoop
          duration={30}
          className="[mask-image:none]"
          items={band.items.map((item) => ({
            key: item,
            node: (
              <span className="flex items-center gap-marquee text-3xl font-bold tracking-tight whitespace-nowrap md:text-6xl">
                {item}
                <Sparkle className="size-6 fill-current md:size-10" strokeWidth={1.5} />
              </span>
            ),
          }))}
        />
      </div>
    </div>
  );
}
