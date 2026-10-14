"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DATA } from "@/data/resume";

const COUNT_MS = 1900;
const WARP_UP_MS = 520;
const WARP_DOWN_MS = 900;
const PANEL_COUNT = 7;

/** Status lines, swapped as the counter climbs. Themed on the research. */
const STATUS_LINES = [
  "initialising field",
  "seeding star map",
  "plotting routes",
  "entering orbit",
] as const;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type IntroProps = {
  /** Shared with the cosmos scene; this component drives it during the burst. */
  warpRef: React.RefObject<number>;
  onComplete: () => void;
};

export default function Intro({ warpRef, onComplete }: IntroProps) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [wiping, setWiping] = useState(false);

  // Updated imperatively — a counter at 60fps should not re-render React.
  const counterRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const frame = useRef<number>(0);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    cancelAnimationFrame(frame.current);
    warpRef.current = 0;
    setVisible(false);
    onComplete();
  }, [onComplete, warpRef]);

  // Click or any key skips straight to the page.
  useEffect(() => {
    if (!visible) return;
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [visible, finish]);

  useEffect(() => {
    if (reducedMotion) {
      finish();
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;

      if (elapsed < COUNT_MS) {
        const t = easeOutCubic(elapsed / COUNT_MS);
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.floor(t * 100)).padStart(2, "0");
        }
        if (statusRef.current) {
          const index = Math.min(
            STATUS_LINES.length - 1,
            Math.floor(t * STATUS_LINES.length),
          );
          const line = STATUS_LINES[index];
          if (statusRef.current.textContent !== line) {
            statusRef.current.textContent = line;
          }
        }
        frame.current = requestAnimationFrame(tick);
        return;
      }

      if (counterRef.current) counterRef.current.textContent = "100";

      const warpElapsed = elapsed - COUNT_MS;

      if (warpElapsed < WARP_UP_MS) {
        warpRef.current = easeOutCubic(warpElapsed / WARP_UP_MS);
        if (!wiping) setWiping(true);
        frame.current = requestAnimationFrame(tick);
        return;
      }

      const downT = (warpElapsed - WARP_UP_MS) / WARP_DOWN_MS;
      if (downT < 1) {
        warpRef.current = 1 - easeOutCubic(downT);
        frame.current = requestAnimationFrame(tick);
        return;
      }

      finish();
    };

    frame.current = requestAnimationFrame(tick);

    // rAF is suspended in background tabs; a timer still fires, so the page
    // is never left stuck behind the overlay.
    const safety = window.setTimeout(finish, 4200);

    return () => {
      cancelAnimationFrame(frame.current);
      window.clearTimeout(safety);
    };
    // `wiping` is intentionally excluded: the timeline owns its own lifecycle
    // and must not restart when the wipe flag flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, finish, warpRef]);

  const letters = DATA.name.split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden
        >
          {/* Panels that lift away to reveal the page behind. */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: PANEL_COUNT }).map((_, index) => (
              <motion.div
                key={index}
                className="h-full flex-1 bg-[#05060c]"
                initial={{ y: 0 }}
                animate={wiping ? { y: "-100%" } : { y: 0 }}
                transition={{
                  duration: 0.85,
                  delay: wiping ? index * 0.055 : 0,
                  ease: [0.76, 0, 0.24, 1],
                }}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-10">
            <motion.span
              className="mono text-[11px] uppercase tracking-[0.3em] text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: wiping ? 0 : 1 }}
              transition={{ duration: 0.5 }}
            >
              portfolio
            </motion.span>

            <motion.h1
              className="flex flex-wrap justify-center text-[13vw] font-semibold leading-none tracking-tighter text-white sm:text-[9vw]"
              animate={wiping ? { scale: 1.25, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.1 + index * 0.045,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                >
                  {letter === " " ? " " : letter}
                </motion.span>
              ))}
            </motion.h1>

            <motion.div
              className="flex items-end justify-between gap-4"
              animate={{ opacity: wiping ? 0 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <span className="mono text-[11px] lowercase tracking-[0.2em] text-white/40">
                <span ref={statusRef}>{STATUS_LINES[0]}</span>
              </span>
              <span className="mono text-5xl font-medium tabular-nums text-white sm:text-7xl">
                <span ref={counterRef}>00</span>
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
