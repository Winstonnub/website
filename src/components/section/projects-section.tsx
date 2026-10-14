import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section/section";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";

export default function ProjectsSection() {
  const featured = DATA.projects.filter((project) => project.featured);
  const rest = DATA.projects.filter((project) => !project.featured);

  return (
    <Section
      id="projects"
      eyebrow="03 / projects"
      title="Things I've built"
      description="A scoliosis detector that reads X-rays, a learning app that writes its own lessons, a stock exchange simulated in C, and a blackjack player that taught itself the odds."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {featured.map((project, index) => (
          <Reveal key={project.title} index={index} className="h-full">
            <ProjectCard
              title={project.title}
              subtitle={project.subtitle}
              dates={project.dates}
              description={project.description}
              highlights={project.highlights}
              technologies={project.technologies}
              links={project.links}
              image={project.image}
              video={project.video}
            />
          </Reveal>
        ))}
      </div>

      <Reveal index={2}>
        <div className="mt-12 flex flex-col">
          <span className="eyebrow mb-4">more</span>
          {rest.map((project) => {
            const Wrapper = project.href ? "a" : "div";
            return (
              <Wrapper
                key={project.title}
                {...(project.href
                  ? { href: project.href, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group grid gap-2 border-t border-border py-5 md:grid-cols-[1fr_auto] md:items-start md:gap-8"
              >
                <div className="flex flex-col gap-1.5">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                    {project.title}
                    <span className="mono font-normal text-muted-foreground">
                      · {project.subtitle}
                    </span>
                    {project.href && (
                      <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </h3>
                  <p className="max-w-2xl text-pretty text-[13px] leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="mono rounded-md border border-border bg-card/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="mono text-[11px] text-muted-foreground md:pt-1">
                  {project.dates}
                </span>
              </Wrapper>
            );
          })}
        </div>
      </Reveal>
    </Section>
  );
}
