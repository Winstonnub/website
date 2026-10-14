"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

type EasterEggsProps = {
  /** Called when the sequence completes. Return false to show the fallback toast. */
  onKonami?: () => boolean | void;
};

/**
 * Console greeting plus the Konami sequence. Both are deliberately quiet: the
 * console note only appears for people who open devtools, and the sequence is
 * reported with a toast when there is no effect to run.
 */
export default function EasterEggs({ onKonami }: EasterEggsProps) {
  const progress = useRef(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // Styled once per load, for anyone poking around in devtools.
    const title = "color:#4fd8e8;font-size:14px;font-weight:600";
    const body = "color:#9bb0c4;font-size:12px";
    console.log("%cWinston Liang", title);
    console.log(
      "%cReinforcement learning at NUS, software engineering at Shopify.\n" +
        "The hero grid runs real A* — src/lib/pathfinding.ts\n" +
        "Try ⌘K. And the Konami code still works.",
      body,
    );
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const expected = KONAMI[progress.current];
      const pressed = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (pressed === expected) {
        progress.current += 1;
        if (progress.current === KONAMI.length) {
          progress.current = 0;
          const handled = onKonami?.();
          if (handled === false || handled === undefined) {
            setToast("↑↑↓↓←→←→BA — hyperspace lives on the home page");
            window.setTimeout(() => setToast(null), 3200);
          }
        }
      } else {
        // Allow a miss to restart the sequence if it matches the first key.
        progress.current = pressed === KONAMI[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKonami]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="mono fixed bottom-20 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-primary/40 bg-background/90 px-4 py-2 text-[12px] text-primary backdrop-blur"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
