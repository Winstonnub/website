/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/section/section";
import { DATA } from "@/data/resume";

export default function EducationSection() {
  return (
    <Section id="education" eyebrow="02 / education" title="Education">
      {DATA.education.map((school, index) => (
        <Reveal key={school.school} index={index}>
          <a
            href={school.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={school.logoUrl}
                alt=""
                className="size-14 flex-none rounded-lg border border-border bg-card object-contain p-2"
              />
              <div className="flex flex-col gap-0.5">
                <h3 className="flex items-center gap-1.5 font-semibold tracking-tight">
                  {school.school}
                  <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <span className="text-sm text-muted-foreground">
                  {school.degree} · {school.focus}
                </span>
                <span className="mono text-[11px] text-primary/90">
                  {school.description}
                </span>
              </div>
            </div>
            <span className="mono flex-none text-[11px] text-muted-foreground">
              {school.start} — {school.end}
            </span>
          </a>
        </Reveal>
      ))}
    </Section>
  );
}
