/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section/section";
import { DATA } from "@/data/resume";

export default function WorkSection() {
  return (
    <Section
      id="work"
      eyebrow="01 / experience"
      title="Where I've worked"
    >
      <div className="flex flex-col">
        {DATA.work.map((role, index) => (
          <Reveal key={`${role.company}-${role.title}`} index={index}>
            <article className="group grid gap-5 border-t border-border py-8 md:grid-cols-[180px_1fr] md:gap-10">
              <div className="flex items-start gap-3 md:flex-col md:gap-3">
                <img
                  src={role.logoUrl}
                  alt=""
                  className="size-12 flex-none rounded-lg border border-border bg-card object-contain p-1.5"
                />
                <div className="flex flex-col gap-1">
                  <span className="mono text-[11px] text-muted-foreground">
                    {role.start} — {role.end}
                  </span>
                  {role.current && (
                    <span className="mono inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                      current
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {role.title}
                  </h3>
                  <a
                    href={role.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {role.company}
                    {"team" in role && role.team ? ` · ${role.team}` : ""}
                    <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                  <span className="mono text-[11px] text-muted-foreground">
                    {role.location}
                  </span>
                </div>

                <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
                  {role.summary}
                </p>

                <ul className="flex max-w-2xl flex-col gap-2.5 pt-1">
                  {role.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="relative pl-4 text-pretty text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-primary/60"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {role.stack.map((tech) => (
                    <span
                      key={tech}
                      className="mono rounded-md border border-border bg-card/50 px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}

        <Reveal index={DATA.work.length}>
          <div className="flex flex-col gap-4 border-t border-border py-8 md:flex-row md:items-center md:gap-10">
            <span className="eyebrow md:w-[180px]">also</span>
            {DATA.otherExperience.map((item) => (
              <div key={item.company} className="flex items-center gap-3">
                <img
                  src={item.logoUrl}
                  alt=""
                  className="size-11 flex-none rounded-lg border border-border bg-card object-contain p-1.5"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {item.title} · {item.company}
                  </span>
                  <span className="mono text-[11px] text-muted-foreground">
                    {item.start} — {item.end} · {item.summary}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
