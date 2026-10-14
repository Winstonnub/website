"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Shuffle } from "lucide-react";
import { cellKey, toggleCell, isWalkable, type Cell, type Grid } from "@/lib/pathfinding";
import {
  at,
  planIndependent,
  planPrioritized,
  type Agent,
  type PlanResult,
} from "@/lib/mapf";

const COLS = 16;
const ROWS = 12;
const AGENT_COUNT = 6;
const TICKS_PER_SECOND = 2.6;

const AGENT_COLORS = [
  "#4fd8e8",
  "#7c7cf0",
  "#49e8b0",
  "#e8d04f",
  "#f08ac0",
  "#ff8f5e",
];

/** A corridor with a single two-cell gap — the setup that forces conflicts. */
const corridorGrid = (): Grid => {
  const blocked = new Set<string>();
  for (let y = 0; y < ROWS; y += 1) {
    if (y !== 5 && y !== 6) blocked.add(cellKey(8, y));
  }
  return { cols: COLS, rows: ROWS, blocked };
};

const emptyGrid = (): Grid => ({ cols: COLS, rows: ROWS, blocked: new Set() });

/** Agents crossing the map in both directions. */
const makeAgents = (grid: Grid, seed = 0): Agent[] => {
  const agents: Agent[] = [];
  for (let i = 0; i < AGENT_COUNT; i += 1) {
    const row = 1 + ((i * 2 + seed) % (ROWS - 2));
    const leftToRight = i % 2 === 0;
    const start = { x: leftToRight ? 0 : COLS - 1, y: row };
    const goal = { x: leftToRight ? COLS - 1 : 0, y: row };
    if (isWalkable(grid, start.x, start.y) && isWalkable(grid, goal.x, goal.y)) {
      agents.push({ id: i, start, goal });
    }
  }
  return agents;
};

type BoardProps = {
  title: string;
  subtitle: string;
  grid: Grid;
  agents: readonly Agent[];
  plan: PlanResult;
  time: number;
  onToggle?: (cell: Cell) => void;
  accent: string;
};

function Board({
  title,
  subtitle,
  grid,
  agents,
  plan,
  time,
  onToggle,
  accent,
}: BoardProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const painting = useRef(false);

  // Live conflict count at the current tick, so the number climbs as it plays.
  const conflictsSoFar = useMemo(() => {
    let count = 0;
    const upto = Math.floor(time);
    for (let t = 0; t <= upto; t += 1) {
      const seen = new Map<string, number>();
      for (let i = 0; i < plan.paths.length; i += 1) {
        const cell = at(plan.paths[i], t);
        const key = cellKey(cell.x, cell.y);
        if (seen.has(key)) count += 1;
        else seen.set(key, i);
      }
    }
    return count;
  }, [plan.paths, time]);

  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const ctx = node.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = node.clientWidth;
    const cellSize = width / COLS;
    const height = cellSize * ROWS;

    node.width = width * dpr;
    node.height = height * dpr;
    node.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#0b1016";
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x += 1) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, height);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y += 1) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(width, y * cellSize);
      ctx.stroke();
    }

    // Walls
    ctx.fillStyle = "#223040";
    for (const key of grid.blocked) {
      const [x, y] = key.split(",").map(Number);
      ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    }

    // Goals
    agents.forEach((agent, i) => {
      ctx.strokeStyle = AGENT_COLORS[i % AGENT_COLORS.length];
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(
        agent.goal.x * cellSize + cellSize * 0.25,
        agent.goal.y * cellSize + cellSize * 0.25,
        cellSize * 0.5,
        cellSize * 0.5,
      );
      ctx.globalAlpha = 1;
    });

    // Agents, interpolated between the current and next tick
    const tFloor = Math.floor(time);
    const frac = time - tFloor;
    const positions: { x: number; y: number; i: number }[] = [];

    plan.paths.forEach((path, i) => {
      const a = at(path, tFloor);
      const b = at(path, tFloor + 1);
      const px = (a.x + (b.x - a.x) * frac + 0.5) * cellSize;
      const py = (a.y + (b.y - a.y) * frac + 0.5) * cellSize;
      positions.push({ x: px, y: py, i });

      ctx.fillStyle = AGENT_COLORS[i % AGENT_COLORS.length];
      ctx.beginPath();
      ctx.arc(px, py, cellSize * 0.28, 0, Math.PI * 2);
      ctx.fill();
    });

    // Flash a ring wherever two agents overlap right now.
    for (let i = 0; i < positions.length; i += 1) {
      for (let j = i + 1; j < positions.length; j += 1) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        if (Math.hypot(dx, dy) < cellSize * 0.4) {
          ctx.strokeStyle = "#ff5c5c";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(
            (positions[i].x + positions[j].x) / 2,
            (positions[i].y + positions[j].y) / 2,
            cellSize * 0.52,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
        }
      }
    }
  }, [grid, agents, plan, time]);

  const cellFromEvent = (event: React.PointerEvent<HTMLCanvasElement>): Cell | null => {
    const node = canvas.current;
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    const cellSize = rect.width / COLS;
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return null;
    return { x, y };
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h4 className="text-sm font-semibold" style={{ color: accent }}>
          {title}
        </h4>
        <p className="mono text-[11px] text-muted-foreground">{subtitle}</p>
      </div>

      <canvas
        ref={canvas}
        className={onToggle ? "w-full cursor-crosshair rounded-xl border border-border" : "w-full rounded-xl border border-border"}
        onPointerDown={(event) => {
          if (!onToggle) return;
          painting.current = true;
          const cell = cellFromEvent(event);
          if (cell) onToggle(cell);
        }}
        onPointerMove={(event) => {
          if (!onToggle || !painting.current) return;
          const cell = cellFromEvent(event);
          if (cell) onToggle(cell);
        }}
        onPointerUp={() => (painting.current = false)}
        onPointerLeave={() => (painting.current = false)}
      />

      <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
        <div className="bg-background p-2.5">
          <dt className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Conflicts now / total
          </dt>
          <dd
            className="mono text-lg"
            style={{ color: plan.collisions > 0 ? "#ff5c5c" : accent }}
          >
            {conflictsSoFar}
            {/* The running count alone reads as 0 when paused at the start,
                which hides the whole point; show the plan's total too. */}
            <span className="text-[11px] text-muted-foreground">
              {" "}/ {plan.collisions}
            </span>
          </dd>
        </div>
        <div className="bg-background p-2.5">
          <dt className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Makespan
          </dt>
          <dd className="mono text-lg text-foreground">{plan.makespan}</dd>
        </div>
        <div className="bg-background p-2.5">
          <dt className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Unrouted
          </dt>
          <dd
            className="mono text-lg"
            style={{ color: plan.failed > 0 ? "#ff5c5c" : "inherit" }}
          >
            {plan.failed}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * Runs both planners on the same map at the same time, so the cost of ignoring
 * other agents is visible rather than asserted.
 */
export default function MapfRace() {
  const [grid, setGrid] = useState<Grid>(corridorGrid);
  const [seed, setSeed] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);

  const agents = useMemo(() => makeAgents(grid, seed), [grid, seed]);
  const independent = useMemo(() => planIndependent(grid, agents), [grid, agents]);
  const prioritized = useMemo(() => planPrioritized(grid, agents), [grid, agents]);

  const horizon = Math.max(independent.makespan, prioritized.makespan) + 2;

  useEffect(() => {
    if (!playing) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      setTime((t) => {
        const next = t + delta * TICKS_PER_SECOND;
        return next > horizon ? 0 : next;
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, horizon]);

  const handleToggle = useCallback((cell: Cell) => {
    setGrid((current) => toggleCell(current, cell.x, cell.y));
    setTime(0);
  }, []);

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="mono text-[11px] text-muted-foreground">
          Draw walls on either grid. Both planners re-plan instantly.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] transition-colors hover:border-primary/50"
          >
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setSeed((s) => s + 1);
              setTime(0);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] transition-colors hover:border-primary/50"
          >
            <Shuffle className="size-3.5" />
            Shuffle agents
          </button>
          <button
            type="button"
            onClick={() => {
              setGrid(corridorGrid());
              setTime(0);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] transition-colors hover:border-primary/50"
          >
            <RotateCcw className="size-3.5" />
            Corridor
          </button>
          <button
            type="button"
            onClick={() => {
              setGrid(emptyGrid());
              setTime(0);
            }}
            className="rounded-full border border-border px-3 py-1.5 text-[12px] transition-colors hover:border-primary/50"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Board
          title="Independent A*"
          subtitle="Every agent plans alone"
          grid={grid}
          agents={agents}
          plan={independent}
          time={time}
          onToggle={handleToggle}
          accent="#ff8f5e"
        />
        <Board
          title="Prioritized space-time A*"
          subtitle="Plans against a reservation table"
          grid={grid}
          agents={agents}
          plan={prioritized}
          time={time}
          onToggle={handleToggle}
          accent="#4fd8e8"
        />
      </div>

      <p className="text-pretty text-[13px] leading-relaxed text-muted-foreground">
        Both are classical baselines, not my research policy. Prioritized
        planning is collision-free by construction, but it is incomplete — squeeze
        the map hard enough and watch <span className="text-foreground">Unrouted</span> climb,
        because an agent that plans later can find every route already reserved.
        Getting past that limit is the problem I work on at NUS.
      </p>
    </div>
  );
}
