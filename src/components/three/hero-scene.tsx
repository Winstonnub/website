"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// The whole three.js bundle stays out of the initial payload and off the
// server, and only loads once the hero is actually on screen.
const AgentWorld = dynamic(() => import("@/components/three/agent-world"), {
  ssr: false,
  loading: () => <SceneSkeleton />,
});

function SceneSkeleton() {
  return (
    <div className="lab-grid h-full w-full animate-pulse rounded-2xl bg-[#0b1016]" />
  );
}

export default function HeroScene() {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthQuery = window.matchMedia("(max-width: 768px)");

    const sync = () => {
      setReducedMotion(motionQuery.matches);
      setCompact(widthQuery.matches);
    };

    sync();
    motionQuery.addEventListener("change", sync);
    widthQuery.addEventListener("change", sync);
    return () => {
      motionQuery.removeEventListener("change", sync);
      widthQuery.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const node = container.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={container}
      className="glow-ring relative h-[320px] w-full overflow-hidden rounded-2xl border border-border bg-[#0b1016] sm:h-[400px] lg:h-[460px]"
    >
      {visible && !reducedMotion ? (
        <AgentWorld compact={compact} />
      ) : (
        <StaticFallback reducedMotion={reducedMotion} />
      )}
    </div>
  );
}

/**
 * Shown before the scene enters the viewport, and permanently for visitors who
 * ask for reduced motion.
 */
function StaticFallback({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="lab-grid relative flex h-full w-full items-end justify-start bg-[#0b1016] p-4">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
      />
      {reducedMotion && (
        <p className="mono relative text-[11px] text-muted-foreground">
          Multi-agent pathfinding scene paused — reduced motion is on.
        </p>
      )}
    </div>
  );
}
