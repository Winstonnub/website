"use client";

/* eslint-disable @next/next/no-img-element */
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { DATA } from "@/data/resume";

type Row = {
  key: string;
  logoUrl: string;
  title: string;
  org: string;
  meta: string;
  period: string;
  body: string;
  bullets?: readonly string[];
  current?: boolean;
};

// Education sits above the spine as its own line, so it reads as context for
// the roles rather than another stop on the same track.
const rows: Row[] = [
  ...DATA.work.map((role) => ({
    key: `${role.company}-${role.title}`,
    logoUrl: role.logoUrl,
    title: role.title,
    org: "team" in role && role.team ? `${role.company} · ${role.team}` : role.company,
    meta: role.location,
    period: `${role.start} — ${role.end}`,
    body: role.summary,
    bullets: role.highlights,
    current: role.current,
  })),
  ...DATA.otherExperience.map((item) => ({
    key: item.company,
    logoUrl: item.logoUrl,
    title: item.title,
    org: item.company,
    meta: item.location,
    period: `${item.start} — ${item.end}`,
    body: item.summary,
  })),
];

function EducationLine() {
  return (
    <div className="mb-12 flex flex-col gap-3">
      {DATA.education.map((school) => (
        <a
          key={school.school}
          href={school.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <img
              src={school.logoUrl}
              alt=""
              className="size-12 flex-none rounded-lg border border-white/15 bg-[#05060c] object-contain p-1.5"
            />
            <div className="flex flex-col gap-0.5">
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                Education
              </span>
              <h3 className="text-base font-semibold text-white">
                {school.degree}
              </h3>
              <span className="text-sm text-white/70">{school.school}</span>
              <span className="mono text-[11px] text-primary/90">
                {school.focus} · {school.description}
              </span>
            </div>
          </div>
          <span className="mono flex-none text-[11px] text-white/55">
            {school.start} — {school.end}
          </span>
        </a>
      ))}
    </div>
  );
}

export default function Timeline() {
  const reduced = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 70%", "end 60%"],
  });

  // The spine draws itself downward as the section passes through the viewport.
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div>
      <EducationLine />

      <div ref={container} className="relative pl-14 sm:pl-16">
      {/* Track, plus the drawn progress line on top of it. */}
      <div className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-white/10" />
      <motion.div
        style={{ scaleY: reduced ? 1 : scaleY }}
        className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-primary via-primary/60 to-transparent"
      />

      <div className="flex flex-col gap-12">
        {rows.map((row, index) => (
          <motion.article
            key={row.key}
            initial={reduced ? undefined : { opacity: 0, y: 24 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: Math.min(index, 4) * 0.05 }}
            className="relative"
          >
            <span className="absolute -left-14 top-0 flex size-10 items-center justify-center sm:-left-16">
              <img
                src={row.logoUrl}
                alt=""
                className="size-10 rounded-full border border-white/20 bg-[#05060c] object-contain p-1.5"
              />
            </span>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="display text-xl text-white sm:text-2xl">{row.title}</h3>
                {row.current && (
                  <span className="mono rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                    now
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-sm text-white/85">{row.org}</span>
                <span className="mono text-[11px] text-white/55">{row.meta}</span>
                <span className="mono text-[11px] text-white/55">{row.period}</span>
              </div>

              {row.body && (
                <p className="max-w-2xl text-pretty text-sm leading-relaxed text-white/70">
                  {row.body}
                </p>
              )}

              {row.bullets && row.bullets.length > 0 && (
                <ul className="flex max-w-2xl flex-col gap-2 pt-1">
                  {row.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="relative pl-4 text-pretty text-[13px] leading-relaxed text-white/70 before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-primary/70"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.article>
        ))}
        </div>
      </div>
    </div>
  );
}
