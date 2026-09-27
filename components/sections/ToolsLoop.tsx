import { FadeIn } from "@/components/ui/FadeIn";
import { LogoLoop } from "@/components/ui/LogoLoop";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { tools, type Tool } from "@/content/site";

/** Logo-urile tool-urilor integrate, monocrome, într-o bandă infinită. */
export function ToolsLoop() {
  return (
    <Section aria-labelledby="tools-label">
      <FadeIn>
        <Eyebrow id="tools-label" className="text-center">
          {tools.label}
        </Eyebrow>
      </FadeIn>
      <FadeIn delay={80} className="mt-8 md:mt-10">
        <LogoLoop
          label={tools.label}
          items={tools.items.map((tool) => ({ key: tool.name, node: <ToolLogo tool={tool} /> }))}
        />
      </FadeIn>
    </Section>
  );
}

function ToolLogo({ tool }: { tool: Tool }) {
  return (
    <svg
      role="img"
      aria-label={tool.name}
      viewBox="0 0 24 24"
      className="size-7 fill-current text-foreground opacity-60 transition-opacity duration-base hover:opacity-100 md:size-8"
    >
      <title>{tool.name}</title>
      <path d={tool.icon.path} />
    </svg>
  );
}
