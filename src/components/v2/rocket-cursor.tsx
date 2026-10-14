"use client";

import { useEffect, useRef } from "react";

const TRAIL_COUNT = 22;
const FOLLOW = 0.18;          // how quickly the rocket closes on the pointer
const SPEED_FOR_THRUST = 1.2; // px/frame before the engine lights
const PARTICLE_LIFE = 520;    // ms

type Particle = {
  el: HTMLSpanElement;
  born: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alive: boolean;
};

/** Shortest-path angle interpolation, so the rocket never spins the long way. */
const lerpAngle = (from: number, to: number, t: number): number => {
  let diff = ((to - from + 540) % 360) - 180;
  return from + diff * t;
};

/**
 * A rocket that replaces the pointer: it trails behind the real cursor, banks
 * toward the direction of travel, and fires exhaust when it moves.
 *
 * Everything is written straight to the DOM inside one rAF loop — putting
 * pointer coordinates into React state would re-render the page on every
 * mouse move.
 */
export default function RocketCursor() {
  const rocket = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only for real pointers, and never when motion is unwelcome.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const rocketEl = rocket.current;
    const layerEl = layer.current;
    if (!rocketEl || !layerEl) return;

    document.documentElement.classList.add("rocket-cursor");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...pointer };
    let angle = 0;
    let thrust = 0;
    let hovering = false;
    let visible = false;

    // Reused pool; allocating particles per-frame would churn the GC.
    const particles: Particle[] = Array.from({ length: TRAIL_COUNT }, () => {
      const el = document.createElement("span");
      el.className = "rocket-spark";
      layerEl.appendChild(el);
      return { el, born: 0, x: 0, y: 0, vx: 0, vy: 0, size: 0, alive: false };
    });
    let nextParticle = 0;

    const isInteractive = (target: EventTarget | null): boolean =>
      target instanceof Element &&
      Boolean(target.closest('a, button, [role="button"], input, select, textarea, canvas'));

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      hovering = isInteractive(event.target);
      if (!visible) {
        visible = true;
        rocketEl.style.opacity = "1";
      }
    };

    const onLeave = () => {
      visible = false;
      rocketEl.style.opacity = "0";
    };

    const onDown = () => {
      // Kick the engine on click.
      thrust = Math.min(1, thrust + 0.6);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const tick = () => {
      const now = performance.now();

      const prevX = pos.x;
      const prevY = pos.y;
      pos.x += (pointer.x - pos.x) * FOLLOW;
      pos.y += (pointer.y - pos.y) * FOLLOW;

      const dx = pos.x - prevX;
      const dy = pos.y - prevY;
      const speed = Math.hypot(dx, dy);

      // The artwork points up, so add 90° to face the direction of travel.
      if (speed > 0.4) {
        const target = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        angle = lerpAngle(angle, target, 0.2);
      }

      const wantThrust = speed > SPEED_FOR_THRUST ? 1 : 0;
      thrust += (wantThrust - thrust) * 0.12;

      const scale = (hovering ? 1.25 : 1) * (1 + Math.min(speed, 24) * 0.006);
      rocketEl.style.transform =
        `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${angle}deg) scale(${scale})`;
      rocketEl.style.setProperty("--thrust", thrust.toFixed(3));

      // Emit exhaust from behind the rocket while it is moving.
      if (speed > SPEED_FOR_THRUST) {
        const rad = ((angle - 90) * Math.PI) / 180;
        const tailX = pos.x - Math.cos(rad) * 14;
        const tailY = pos.y - Math.sin(rad) * 14;
        const p = particles[nextParticle];
        nextParticle = (nextParticle + 1) % particles.length;
        p.born = now;
        p.x = tailX;
        p.y = tailY;
        p.vx = -Math.cos(rad) * (0.4 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.6;
        p.vy = -Math.sin(rad) * (0.4 + Math.random() * 0.8) + (Math.random() - 0.5) * 0.6;
        p.size = 3 + Math.random() * 4;
        p.alive = true;
      }

      for (const p of particles) {
        if (!p.alive) continue;
        const age = (now - p.born) / PARTICLE_LIFE;
        if (age >= 1) {
          p.alive = false;
          p.el.style.opacity = "0";
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        const fade = 1 - age;
        p.el.style.transform =
          `translate3d(${p.x}px, ${p.y}px, 0) scale(${fade * p.size * 0.3})`;
        p.el.style.opacity = String(fade * 0.85);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("rocket-cursor");
      particles.forEach((p) => p.el.remove());
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div ref={layer} className="absolute inset-0" />
      <div
        ref={rocket}
        className="rocket-ship absolute left-0 top-0 opacity-0"
        style={{ willChange: "transform" }}
      >
        <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
          {/* exhaust flame — scaled by --thrust */}
          <g className="rocket-flame">
            <path
              d="M13 28c-2.6 2.6-3.4 5.2-3.4 6.6 0 0 1.5-1 3.4-1s3.4 1 3.4 1C16.4 33.2 15.6 30.6 13 28Z"
              fill="#ffb347"
            />
            <path
              d="M13 28c-1.4 1.8-1.9 3.5-1.9 4.4 0 0 .8-.7 1.9-.7s1.9.7 1.9.7c0-.9-.5-2.6-1.9-4.4Z"
              fill="#fff1c9"
            />
          </g>
          {/* body */}
          <path
            d="M13 1c4 3.6 6.2 8.6 6.2 14.2 0 4-1 7.6-2.6 10.4H9.4C7.8 22.8 6.8 19.2 6.8 15.2 6.8 9.6 9 4.6 13 1Z"
            fill="#eef3f8"
          />
          {/* fins */}
          <path d="M6.8 16.6c-2.2 1.8-3.6 4.4-3.8 7.4l3.8-2.2v-5.2Z" fill="#4fd8e8" />
          <path d="M19.2 16.6c2.2 1.8 3.6 4.4 3.8 7.4l-3.8-2.2v-5.2Z" fill="#4fd8e8" />
          {/* window */}
          <circle cx="13" cy="13" r="2.8" fill="#0b1016" />
          <circle cx="13" cy="13" r="1.8" fill="#4fd8e8" />
        </svg>
      </div>
    </div>
  );
}
