/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section/section";
import { DATA } from "@/data/resume";

type Role = (typeof DATA.leadership)[number];

// Only some entries carry these, so they are read defensively off the union.
const imageOf = (role: Role): string | undefined =>
  "image" in role ? role.image : undefined;
const imageAltOf = (role: Role): string =>
  "imageAlt" in role ? role.imageAlt : "";
const highlightsOf = (role: Role): readonly string[] =>
  "highlights" in role ? role.highlights : [];
const isCurrent = (role: Role): boolean =>
  "current" in role ? Boolean(role.current) : false;

export default function LeadershipSection() {
  return (
    <Section
      id="leadership"
      eyebrow="07 / involvement"
      title="Leadership & community"
      description="Student ML research, a conference, event programming for the UofT Hong Kong community, and a long run of building things for my high school."
    >
      <div className="flex flex-col">
        {DATA.leadership.map((role, index) => {
          const image = imageOf(role);
          const highlights = highlightsOf(role);
          const href = role.href;

          return (
            <Reveal key={`${role.company}-${role.title}`} index={index}>
              <article className="grid gap-3 border-t border-border py-5 md:grid-cols-[1fr_auto] md:gap-8">
                <div className="flex items-start gap-3">
                  <img
                    src={role.logoUrl}
                    alt=""
                    className="size-11 flex-none rounded-lg border border-border bg-card object-contain p-1.5"
                  />
                  <div className="flex flex-col gap-1">
                    <h3 className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                      {role.title}
                      {isCurrent(role) && (
                        <span className="mono rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                          now
                        </span>
                      )}
                    </h3>

                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mono inline-flex w-fit items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-primary"
                      >
                        {role.company}
                        <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    ) : (
                      <span className="mono text-[11px] text-muted-foreground">
                        {role.company}
                      </span>
                    )}

                    <p className="max-w-2xl text-pretty text-[13px] leading-relaxed text-muted-foreground">
                      {role.description}
                    </p>

                    {highlights.length > 0 && (
                      <ul className="flex max-w-2xl flex-col gap-1.5 pt-1">
                        {highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="relative pl-4 text-pretty text-[13px] leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-primary/60"
                          >
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}

                    {image && (
                      <figure className="mt-3 max-w-2xl overflow-hidden rounded-xl border border-border">
                        <img
                          src={image}
                          alt={imageAltOf(role)}
                          loading="lazy"
                          decoding="async"
                          className="block w-full object-cover"
                        />
                      </figure>
                    )}
                  </div>
                </div>

                <span className="mono flex-none pl-14 text-[11px] text-muted-foreground md:pl-0">
                  {role.start} — {role.end}
                </span>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
