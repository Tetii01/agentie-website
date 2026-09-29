import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Carousel } from "@/components/ui/Carousel";
import { DetailsDialog } from "@/components/ui/DetailsDialog";
import { FadeIn } from "@/components/ui/FadeIn";
import { Media } from "@/components/ui/Media";
import { Section } from "@/components/ui/Section";
import { VisitLink } from "@/components/ui/VisitLink";
import { projects, ui, type Project } from "@/content/site";
import { displayDomain } from "@/lib/url";

/**
 * Proiecte: carusel imediat sub hero, care se derulează card cu card.
 * Desktop: cardurile alternează lat (2/3) și îngust (1/3), ca un grid de 3 coloane.
 * Tabletă și mobil: un card pe ecran. Dedesubt: bulinele și săgețile.
 * Click pe un card: fereastră cu detalii (câteva carduri scurte în grid).
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
              className="w-full shrink-0 snap-start lg:odd:w-[calc((200%-var(--spacing-grid))/3)] lg:even:w-[calc((100%-2*var(--spacing-grid))/3)]"
            >
              <ProjectCard project={project} id={`proiect-${index + 1}`} />
            </li>
          ))}
        </Carousel>
      </FadeIn>
    </Section>
  );
}

/**
 * Card de proiect: imaginea umple tot cardul; sus numele și categoria, jos descrierea și butonul spre site.
 * Tot cardul deschide detaliile (DetailsDialog); butonul spre site stă deasupra, cu z-20.
 */
function ProjectCard({ project, id }: { project: Project; id: string }) {
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
        <div className="pr-14">
          <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
          <p className="mt-1 text-label font-medium text-accent">{project.category}</p>
        </div>
        <div className="flex items-end justify-between gap-6">
          <p className="max-w-xs text-sm text-pretty text-foreground/85 md:text-base">{project.description}</p>
          <VisitLink
            url={project.url}
            label={`${ui.visitSite} ${project.title}`}
            newTabLabel={ui.externalLink}
            className="relative z-20 shrink-0"
          />
        </div>
      </div>

      <DetailsDialog
        openLabel={`${ui.projectDetails}: ${project.title}`}
        closeLabel={ui.close}
        titleId={`${id}-titlu`}
      >
        <ProjectDetails project={project} titleId={`${id}-titlu`} />
      </DetailsDialog>
    </article>
  );
}

/** Conținutul ferestrei de detalii: imaginea, titlul, descrierea și cardurile cu detalii (2 pe rând). */
function ProjectDetails({ project, titleId }: { project: Project; titleId: string }) {
  return (
    <>
      <Media
        image={project.image}
        label={projects.imagePlaceholderLabel}
        shape="none"
        aspect="wide"
        sizes="(min-width: 896px) 800px, 100vw"
        className="rounded-card-sm border border-border"
      />

      <div className="px-3 pt-6 pb-3 md:px-6 md:pt-8 md:pb-6">
        <p className="text-label font-medium text-accent">{project.category}</p>
        <h2 id={titleId} className="mt-2 text-h3-mobile font-bold text-balance md:text-h3">
          {project.title}
        </h2>
        <p className="mt-3 max-w-xl text-base text-pretty text-muted md:text-lg">{project.description}</p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:mt-8">
          {project.details.map((detail, index) => (
            <li key={index} className="rounded-card-sm border border-border bg-surface-2/60 p-5">
              <p className="text-label font-medium text-accent">{detail.title}</p>
              <p className="mt-2 text-base text-pretty">{detail.text}</p>
            </li>
          ))}
        </ul>

        {displayDomain(project.url) && (
          <Button href={project.url} variant="secondary" className="mt-6 md:mt-8">
            {ui.visitSite}
            <ArrowUpRight aria-hidden className="size-4" />
            <span className="sr-only">{ui.externalLink}</span>
          </Button>
        )}
      </div>
    </>
  );
}
