"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

type MaskTextProps = {
  /** Each entry becomes its own masked line. */
  lines: readonly string[];
  className?: string;
  delay?: number;
  /**
   * When provided, drives the reveal directly instead of using viewport
   * detection. Used by the hero, which sits behind the intro overlay.
   */
  active?: boolean;
};

/**
 * Reveals text line by line from behind a mask, the way a title card lands.
 *
 * The viewport check is deliberately attached to the unclipped root rather
 * than the animated line. A line starts translated fully outside its
 * `overflow: hidden` wrapper, and IntersectionObserver honours ancestor
 * clipping — so observing the line itself reports zero intersection, the
 * reveal never fires, and the text stays hidden forever.
 */
export function MaskText({
  lines,
  className,
  delay = 0,
  active,
}: MaskTextProps) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLSpanElement>(null);
  const inView = useInView(root, { once: true, margin: "-10% 0px" });

  const revealed = active ?? inView;
  const show = reduced || revealed;

  return (
    <span ref={root} className={className}>
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={reduced ? false : { y: "110%" }}
            animate={show ? { y: "0%" } : { y: "110%" }}
            transition={{
              duration: 0.85,
              delay: delay + index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
