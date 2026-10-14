/**
 * Two classical multi-agent path-finding baselines, for side-by-side comparison.
 *
 * `planIndependent` is what you get when every agent plans for itself and
 * ignores the others: fast, and full of collisions.
 *
 * `planPrioritized` plans agents one at a time against a reservation table,
 * searching over (x, y, time) rather than (x, y), so a path can wait in place
 * to let someone past. It is collision-free by construction but incomplete —
 * a later agent can find itself with nowhere to go.
 *
 * Both are the textbook baselines the research improves on. Neither is a
 * learned policy.
 */

import { cellKey, isWalkable, type Cell, type Grid } from "./pathfinding";

export type Path = readonly Cell[];

export type Agent = {
  readonly id: number;
  readonly start: Cell;
  readonly goal: Cell;
};

export type PlanResult = {
  readonly paths: readonly Path[];
  /** Agents the planner could not route at all. */
  readonly failed: number;
  /** Timesteps until the last agent reaches its goal. */
  readonly makespan: number;
  /** Vertex conflicts plus edge swaps across the whole plan. */
  readonly collisions: number;
};

const NEIGHBOURS: readonly Cell[] = [
  { x: 0, y: 0 }, // wait
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

const manhattan = (a: Cell, b: Cell): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const sameCell = (a: Cell, b: Cell): boolean => a.x === b.x && a.y === b.y;

/** Position of an agent at time t; it rests on its goal once finished. */
export const at = (path: Path, t: number): Cell =>
  path[Math.min(t, path.length - 1)];

/**
 * Counts vertex conflicts (two agents on one cell) and edge conflicts (two
 * agents swapping through each other) over the full horizon.
 */
export const countCollisions = (paths: readonly Path[]): number => {
  const horizon = Math.max(1, ...paths.map((p) => p.length));
  let collisions = 0;

  for (let t = 0; t < horizon; t += 1) {
    const occupied = new Map<string, number>();

    for (let i = 0; i < paths.length; i += 1) {
      if (paths[i].length === 0) continue;
      const cell = at(paths[i], t);
      const key = cellKey(cell.x, cell.y);
      if (occupied.has(key)) collisions += 1;
      else occupied.set(key, i);

      // Edge swap: i and j trade places between t-1 and t.
      if (t > 0) {
        for (let j = i + 1; j < paths.length; j += 1) {
          if (paths[j].length === 0) continue;
          const iPrev = at(paths[i], t - 1);
          const jPrev = at(paths[j], t - 1);
          const jNow = at(paths[j], t);
          if (sameCell(cell, jPrev) && sameCell(jNow, iPrev)) collisions += 1;
        }
      }
    }
  }

  return collisions;
};

export const makespanOf = (paths: readonly Path[]): number =>
  paths.length === 0 ? 0 : Math.max(...paths.map((p) => Math.max(0, p.length - 1)));

/** Plain A* over (x, y), one agent, everyone else invisible. */
const singleAgentPath = (grid: Grid, start: Cell, goal: Cell): Path | null => {
  if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
    return null;
  }

  const open = new Map<string, Cell>([[cellKey(start.x, start.y), start]]);
  const cameFrom = new Map<string, string>();
  const g = new Map<string, number>([[cellKey(start.x, start.y), 0]]);
  const f = new Map<string, number>([[cellKey(start.x, start.y), manhattan(start, goal)]]);
  const closed = new Set<string>();
  const goalKey = cellKey(goal.x, goal.y);

  while (open.size > 0) {
    let bestKey = "";
    let best: Cell = start;
    let bestScore = Infinity;
    for (const [key, cell] of open) {
      const score = f.get(key) ?? Infinity;
      if (score < bestScore) {
        bestScore = score;
        bestKey = key;
        best = cell;
      }
    }

    if (bestKey === goalKey) {
      const path: Cell[] = [best];
      let key = bestKey;
      while (cameFrom.has(key)) {
        key = cameFrom.get(key) as string;
        const [x, y] = key.split(",").map(Number);
        path.push({ x, y });
      }
      return path.reverse();
    }

    open.delete(bestKey);
    closed.add(bestKey);

    for (const move of NEIGHBOURS) {
      if (move.x === 0 && move.y === 0) continue;
      const nx = best.x + move.x;
      const ny = best.y + move.y;
      if (!isWalkable(grid, nx, ny)) continue;
      const key = cellKey(nx, ny);
      if (closed.has(key)) continue;

      const tentative = (g.get(bestKey) ?? Infinity) + 1;
      if (tentative >= (g.get(key) ?? Infinity)) continue;

      cameFrom.set(key, bestKey);
      g.set(key, tentative);
      f.set(key, tentative + manhattan({ x: nx, y: ny }, goal));
      if (!open.has(key)) open.set(key, { x: nx, y: ny });
    }
  }

  return null;
};

export const planIndependent = (grid: Grid, agents: readonly Agent[]): PlanResult => {
  const paths: Path[] = [];
  let failed = 0;

  for (const agent of agents) {
    const path = singleAgentPath(grid, agent.start, agent.goal);
    if (path) paths.push(path);
    else {
      paths.push([agent.start]);
      failed += 1;
    }
  }

  return {
    paths,
    failed,
    makespan: makespanOf(paths),
    collisions: countCollisions(paths),
  };
};

type Reservation = {
  /** "x,y,t" for cells, so two agents cannot share one at the same tick. */
  readonly cells: Set<string>;
  /** "x,y->x,y,t" so two agents cannot swap through one another. */
  readonly edges: Set<string>;
};

const reserve = (reservation: Reservation, path: Path, horizon: number): void => {
  for (let t = 0; t <= horizon; t += 1) {
    const cell = at(path, t);
    reservation.cells.add(`${cell.x},${cell.y},${t}`);
    if (t > 0) {
      const prev = at(path, t - 1);
      reservation.edges.add(`${prev.x},${prev.y}->${cell.x},${cell.y},${t}`);
    }
  }
};

/** True when nothing is reserved on `cell` from `from` through the horizon. */
const goalFreeFrom = (
  reservation: Reservation,
  cell: Cell,
  from: number,
  horizon: number,
): boolean => {
  for (let t = from; t <= horizon; t += 1) {
    if (reservation.cells.has(`${cell.x},${cell.y},${t}`)) return false;
  }
  return true;
};

/** A* over (x, y, time), respecting a reservation table. Waiting is allowed. */
const spaceTimePath = (
  grid: Grid,
  start: Cell,
  goal: Cell,
  reservation: Reservation,
  horizon: number,
): Path | null => {
  if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
    return null;
  }

  type Node = { cell: Cell; t: number };
  const key = (n: Node) => `${n.cell.x},${n.cell.y},${n.t}`;

  const startNode: Node = { cell: start, t: 0 };
  const open = new Map<string, Node>([[key(startNode), startNode]]);
  const cameFrom = new Map<string, string>();
  const nodes = new Map<string, Node>([[key(startNode), startNode]]);
  const g = new Map<string, number>([[key(startNode), 0]]);
  const f = new Map<string, number>([[key(startNode), manhattan(start, goal)]]);

  while (open.size > 0) {
    let bestKey = "";
    let best: Node = startNode;
    let bestScore = Infinity;
    for (const [k, node] of open) {
      const score = f.get(k) ?? Infinity;
      if (score < bestScore) {
        bestScore = score;
        bestKey = k;
        best = node;
      }
    }

    // Accept the goal only if the agent can also *stay* there. An agent that
    // parks on its goal occupies it for the rest of the horizon, so arriving
    // while someone else still needs to pass through is a target conflict.
    if (sameCell(best.cell, goal) && goalFreeFrom(reservation, goal, best.t, horizon)) {
      const path: Cell[] = [best.cell];
      let k = bestKey;
      while (cameFrom.has(k)) {
        k = cameFrom.get(k) as string;
        const node = nodes.get(k);
        if (!node) break;
        path.push(node.cell);
      }
      return path.reverse();
    }

    open.delete(bestKey);
    if (best.t >= horizon) continue;

    for (const move of NEIGHBOURS) {
      const nx = best.cell.x + move.x;
      const ny = best.cell.y + move.y;
      if (!isWalkable(grid, nx, ny)) continue;

      const nt = best.t + 1;
      if (reservation.cells.has(`${nx},${ny},${nt}`)) continue;
      // Block the swap: someone moving the opposite way on this edge.
      if (reservation.edges.has(`${nx},${ny}->${best.cell.x},${best.cell.y},${nt}`)) {
        continue;
      }

      const next: Node = { cell: { x: nx, y: ny }, t: nt };
      const nextKey = key(next);
      const tentative = (g.get(bestKey) ?? Infinity) + 1;
      if (tentative >= (g.get(nextKey) ?? Infinity)) continue;

      nodes.set(nextKey, next);
      cameFrom.set(nextKey, bestKey);
      g.set(nextKey, tentative);
      f.set(nextKey, tentative + manhattan(next.cell, goal));
      if (!open.has(nextKey)) open.set(nextKey, next);
    }
  }

  return null;
};

export const planPrioritized = (
  grid: Grid,
  agents: readonly Agent[],
  horizon = 90,
): PlanResult => {
  const reservation: Reservation = { cells: new Set(), edges: new Set() };
  const paths: Path[] = [];
  let failed = 0;

  for (const agent of agents) {
    const path = spaceTimePath(grid, agent.start, agent.goal, reservation, horizon);
    if (path) {
      paths.push(path);
      reserve(reservation, path, horizon);
    } else {
      // Incompleteness in action: this agent has to sit still, and it still
      // blocks the cell it is standing on.
      const parked: Path = [agent.start];
      paths.push(parked);
      reserve(reservation, parked, horizon);
      failed += 1;
    }
  }

  return {
    paths,
    failed,
    makespan: makespanOf(paths),
    collisions: countCollisions(paths),
  };
};
