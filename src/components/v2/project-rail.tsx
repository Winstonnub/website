"use client";

/* eslint-disable @next/next/no-img-element */
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DATA } from "@/data/resume";

type Project = (typeof DATA.projects)[number];

function RailCard({ project, index }: { project: Project; index: number }) {
  const media = project.video || project.image;

  return (
    <article className="void-panel relative flex w-[80vw] shrink-0 snap-start flex-col overflow-hidden rounded-3xl sm:w-[58vw] lg:w-[36vw]">
      <span className="mono absolute right-5 top-5 z-10 text-[11px] text-white/45">
        {String(index + 1).padStart(2, "0")}
      </span>

      {media && (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/10 bg-black/40">
          {project.video ? (
            <video
              src={project.video}
              poster={project.image || undefined}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="size-full object-cover opacity-85"
            />
          ) : (
            <img
              src={project.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover opacity-85"
            />
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <span className="mono text-[11px] text-primary">{project.dates}</span>
          <h3 className="display text-3xl text-white">{project.title}</h3>
          <span className="mono text-[12px] text-white/60">{project.subtitle}</span>
        </div>

        <p className="text-pretty text-[14px] leading-relaxed text-white/75">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="mono rounded-md border border-white/15 px-2 py-0.5 text-[11px] text-white/65"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.links.map((link) => (
              <a
                key={link.type}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-[11px] text-white/85 transition-colors hover:border-primary hover:text-primary"
              >
                {link.icon}
                {link.type}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * A genuinely scrollable rail rather than a scroll-jacked pin: it accepts
 * trackpad swipes, touch, click-and-drag, the arrow buttons and the keyboard,
 * and it keeps the page's own scrollbar meaning what it normally means.
 */
export default function ProjectRail() {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Drag-to-pan state, kept in refs so dragging never re-renders.
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const moved = useRef(false);

  const syncEdges = useCallback(() => {
    const node = scroller.current;
    if (!node) return;
    setAtStart(node.scrollLeft <= 8);
    setAtEnd(node.scrollLeft >= node.scrollWidth - node.clientWidth - 8);
  }, []);

  useEffect(() => {
    syncEdges();
    const node = scroller.current;
    if (!node) return;
    node.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      node.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  const step = useCallback((direction: 1 | -1) => {
    const node = scroller.current;
    if (!node) return;
    const card = node.querySelector("article");
    const distance = card ? card.clientWidth + 24 : node.clientWidth * 0.8;
    node.scrollBy({ left: direction * distance, behavior: "smooth" });
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  };

  const onPointerDown = (event: React.PointerEvent) => {
    const node = scroller.current;
    if (!node) return;
    dragging.current = true;
    moved.current = false;
    startX.current = event.clientX;
    startScroll.current = node.scrollLeft;
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const node = scroller.current;
    if (!dragging.current || !node) return;
    const delta = event.clientX - startX.current;
    if (Math.abs(delta) > 4) moved.current = true;
    node.scrollLeft = startScroll.current - delta;
  };

  const endDrag = () => {
    dragging.current = false;
  };

  // Suppress the click that follows a drag, so dragging across a card's link
  // does not navigate.
  const onClickCapture = (event: React.MouseEvent) => {
    if (moved.current) {
      event.preventDefault();
      event.stopPropagation();
      moved.current = false;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 sm:px-10">
        <p className="mono text-[11px] text-white/55">
          Drag, swipe, or use the arrows
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label="Previous project"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label="Next project"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        tabIndex={0}
        role="region"
        aria-label="Projects"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-4 active:cursor-grabbing focus-visible:outline-none sm:px-10"
      >
        {DATA.projects.map((project, index) => (
          <RailCard key={project.title} project={project} index={index} />
        ))}
        {/* Lets the final card settle away from the viewport edge. */}
        <div aria-hidden className="w-[6vw] shrink-0" />
      </div>
    </div>
  );
}
