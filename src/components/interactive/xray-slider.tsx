"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useRef, useState } from "react";

/**
 * Before/after wipe over a single X-ray: raw on the left, YOLOv8 detections on
 * the right. Both frames come from the project's own demo recording, so the
 * boxes and confidences are the model's real output.
 */
export default function XraySlider() {
  const [position, setPosition] = useState(50);
  const container = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const node = container.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <figure className="flex flex-col gap-3">
      <div
        ref={container}
        className="relative w-full cursor-ew-resize select-none overflow-hidden rounded-2xl border border-border bg-[#0b1016]"
        onPointerDown={(event) => {
          dragging.current = true;
          setFromClientX(event.clientX);
        }}
        onPointerMove={(event) => {
          if (dragging.current) setFromClientX(event.clientX);
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerLeave={() => (dragging.current = false)}
      >
        <img
          src="/xray-before.jpg"
          alt="Spinal X-ray before inference"
          className="block w-full"
          draggable={false}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <img
            src="/xray-after.jpg"
            alt="The same X-ray with YOLOv8 vertebra detections overlaid"
            className="block w-full"
            draggable={false}
          />
        </div>

        {/* Handle */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-primary"
          style={{ left: `${position}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary bg-background text-primary shadow-lg">
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
              <path
                d="M9 6l-5 6 5 6M15 6l5 6-5 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <span className="mono pointer-events-none absolute bottom-3 left-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] text-muted-foreground backdrop-blur">
          raw
        </span>
        <span className="mono pointer-events-none absolute bottom-3 right-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] text-primary backdrop-blur">
          detections
        </span>
      </div>

      {/* The same control as a real input, for keyboard and screen readers. */}
      <label className="flex items-center gap-3">
        <span className="mono text-[11px] text-muted-foreground">Wipe</span>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Reveal YOLOv8 detections"
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-primary"
        />
      </label>

      <figcaption className="text-pretty text-[13px] leading-relaxed text-muted-foreground">
        YOLOv8 trained on ~1,500 labelled images. Each box is a vertebra with its
        confidence; the long box is the scoliosis classification. Frames taken
        from the project&apos;s own demo.
      </figcaption>
    </figure>
  );
}
