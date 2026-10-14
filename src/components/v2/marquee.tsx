"use client";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: readonly string[];
  /** Seconds for one full pass. Larger is slower. */
  duration?: number;
  reverse?: boolean;
  className?: string;
};

/**
 * An endlessly scrolling row. The track is duplicated so the loop point is
 * invisible; `aria-hidden` on the copy keeps it out of the accessibility tree.
 */
export function Marquee({
  items,
  duration = 36,
  reverse = false,
  className,
}: MarqueeProps) {
  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            "flex shrink-0 items-center gap-3 pr-3",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
          )}
          style={{ animationDuration: `${duration}s` }}
        >
          {items.map((item) => (
            <span
              key={item}
              className="mono whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[13px] text-white/70 backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
            >
              {item}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
