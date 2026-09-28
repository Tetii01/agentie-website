import { Carousel } from "@/components/ui/Carousel";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { FadeIn } from "@/components/ui/FadeIn";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { projects, ui, type Project } from "@/content/site";

/**
 * Proiecte: carusel pe pagini, imediat sub hero.
 * Desktop: câte două carduri pe pagină, unul lat (2/3) și unul îngust (1/3), ca un grid de 3 coloane.
 * Tabletă și mobil: un card pe pagină. Dedesubt: bulinele (paginile) și săgețile.
 */
export function Projects() {
  return (
    <Section id={projects.id} aria-labelledby="proiecte-titlu">
      <h2 id="proiecte-titlu" className="sr-only">
        {projects.title}
      </h2>

      <FadeIn>
        <Carousel labels={ui.carousel} label={projects.title} listClassName="gap-grid-mobile md:gap-grid">
          {projects.items.map((project, index) => (
            <li
              key={`${index}-${project.title}`}
              className="w-full shrink-0 snap-start lg:odd:w-[calc((200%-var(--spacing-grid))/3)] lg:even:w-[calc((100%-2*var(--spacing-grid))/3)] lg:even:snap-align-none"
            >
              <ProjectCard project={project} />
            </li>
          ))}
        </Carousel>
      </FadeIn>
    </Section>
  );
}

/** Card de proiect: imaginea umple tot cardul; sus numele și categoria, jos descrierea și linkul. */
function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card-surface group relative isolate h-[27rem] overflow-hidden rounded-card md:h-[36rem]">
      <div className="absolute inset-0 -z-10 transition-transform duration-base ease-smooth group-hover:scale-[1.03] motion-reduce:transition-none">
        <Media
          image={project.image}
          label={projects.imagePlaceholderLabel}
          shape="none"
          aspect="fill"
          sizes="(min-width: 1024px) 66vw, 100vw"
        />
      </div>
      {/* Umbră sus și jos, ca textul să rămână lizibil peste orice imagine. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-background/70 via-transparent via-40% to-background/85"
      />

      <div className="flex h-full flex-col justify-between p-6 md:p-8">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
          <p className="mt-1 text-label font-medium text-accent">{project.category}</p>
        </div>
        <div className="flex items-end justify-between gap-6">
          <p className="max-w-xs text-sm text-pretty text-foreground/85 md:text-base">{project.description}</p>
          <ExternalLink url={project.url} newTabLabel={ui.externalLink} className="shrink-0" />
        </div>
      </div>
    </article>
  );
}
