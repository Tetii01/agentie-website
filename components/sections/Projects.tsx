import { Card } from "@/components/ui/Card";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { FadeIn } from "@/components/ui/FadeIn";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { projects, ui } from "@/content/site";
import { stagger } from "@/lib/stagger";

export function Projects() {
  return (
    <Section id={projects.id} aria-labelledby="proiecte-titlu">
      <SectionHeading title={projects.title} titleId="proiecte-titlu" />

      <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
        {projects.items.map((project, index) => (
          <FadeIn as="li" key={`${index}-${project.title}`} delay={stagger(index, 3)}>
            <Card as="article" padding="sm" className="group flex h-full flex-col">
              {/* Imaginea: zoom ușor la hover (duration-base = 300ms, ease-smooth). */}
              <div className="overflow-hidden rounded-inner border border-border">
                <div className="transition-transform duration-base ease-smooth group-hover:scale-105 motion-reduce:transition-none">
                  <Media
                    image={project.image}
                    label={projects.imagePlaceholderLabel}
                    shape="none"
                    aspect="landscape"
                    sizes="(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col items-start gap-3 px-3 pt-5 pb-3 md:px-4">
                <Tag>{project.category}</Tag>
                <h3 className="text-xl font-semibold tracking-tight text-balance">{project.title}</h3>
                <p className="text-base text-pretty text-muted">{project.description}</p>
                <ExternalLink url={project.url} newTabLabel={ui.externalLink} className="mt-auto pt-2" />
              </div>
            </Card>
          </FadeIn>
        ))}
      </ul>
    </Section>
  );
}
