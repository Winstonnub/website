"use client";

/* eslint-disable @next/next/no-img-element */
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";

export type ProjectCardProps = {
  title: string;
  subtitle: string;
  dates: string;
  description: string;
  highlights: readonly string[];
  technologies: readonly string[];
  links: readonly { type: string; href: string; icon: ReactNode }[];
  image?: string;
  video?: string;
  href?: string;
};

/**
 * Featured project card. Tracks the pointer to drive a soft spotlight and a
 * few degrees of tilt; both are disabled under reduced motion.
 */
export function ProjectCard({
  title,
  subtitle,
  dates,
  description,
  highlights,
  technologies,
  links,
  image,
  video,
}: ProjectCardProps) {
  const reduced = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 22 });

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${useMotionTemplate`calc(${pointerX} * 100%)`} ${useMotionTemplate`calc(${pointerY} * 100%)`}, color-mix(in oklch, var(--primary) 12%, transparent), transparent 70%)`;

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !card.current) return;
    const bounds = card.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    pointerX.set(x);
    pointerY.set(y);
    rotateY.set((x - 0.5) * 6);
    rotateX.set((0.5 - y) * 6);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <motion.div
      ref={card}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40 transition-colors hover:border-primary/40"
    >
      {!reduced && (
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      {(image || video) && (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-[#0b1016]">
          {video ? (
            <video
              src={video}
              poster={image || undefined}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <img
              src={image}
              alt={title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
        </div>
      )}

      <div className="relative flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-semibold tracking-tight">{title}</h3>
            <span className="mono text-[11px] text-muted-foreground">
              {subtitle}
            </span>
          </div>
          <span className="mono flex-none text-[11px] text-muted-foreground">
            {dates}
          </span>
        </div>

        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {highlights.length > 0 && (
          <ul className="flex flex-col gap-2">
            {highlights.map((highlight) => (
              <li
                key={highlight}
                className="relative pl-4 text-pretty text-[13px] leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[0.6em] before:size-1 before:rounded-full before:bg-primary/50"
              >
                {highlight}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="mono rounded-md border border-border bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          {links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {links.map((link) => (
                <a
                  key={link.type}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[11px] font-medium transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {link.icon}
                  {link.type}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
