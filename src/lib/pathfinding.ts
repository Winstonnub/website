/**
 * Grid pathfinding for the hero scene.
 *
 * Pure and side-effect free: every helper returns new values rather than
 * mutating its inputs, so the render loop can treat results as immutable
 * snapshots.
 */

export type Cell = { readonly x: number; readonly y: number };

export type Grid = {
  readonly cols: number;
  readonly rows: number;
  /** Keys of blocked cells, as produced by `cellKey`. */
  readonly blocked: ReadonlySet<string>;
};

export const cellKey = (x: number, y: number): string => `${x},${y}`;

export const isInside = (grid: Grid, x: number, y: number): boolean =>
  x >= 0 && y >= 0 && x < grid.cols && y < grid.rows;

export const isBlocked = (grid: Grid, x: number, y: number): boolean =>
  grid.blocked.has(cellKey(x, y));

export const isWalkable = (grid: Grid, x: number, y: number): boolean =>
  isInside(grid, x, y) && !isBlocked(grid, x, y);

/** Returns a new grid with the given cell toggled between wall and floor. */
export const toggleCell = (grid: Grid, x: number, y: number): Grid => {
  if (!isInside(grid, x, y)) return grid;
  const key = cellKey(x, y);
  const blocked = new Set(grid.blocked);
  if (blocked.has(key)) {
    blocked.delete(key);
  } else {
    blocked.add(key);
  }
  return { ...grid, blocked };
};

const manhattan = (a: Cell, b: Cell): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const NEIGHBOURS: readonly Cell[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

/**
 * A* over 4-connected cells. Returns the full path including `start` and
 * `goal`, or null when no route exists.
 *
 * The open set is a plain array scanned for the lowest f-score. The grid is a
 * few hundred cells at most, so a heap would cost more in allocation than the
 * linear scan costs in comparisons.
 */
export const findPath = (grid: Grid, start: Cell, goal: Cell): Cell[] | null => {
  if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
    return null;
  }

  const startKey = cellKey(start.x, start.y);
  const goalKey = cellKey(goal.x, goal.y);

  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[startKey, 0]]);
  const fScore = new Map<string, number>([[startKey, manhattan(start, goal)]]);
  const open = new Map<string, Cell>([[startKey, start]]);
  const closed = new Set<string>();

  while (open.size > 0) {
    let currentKey = "";
    let current: Cell = start;
    let best = Infinity;

    for (const [key, cell] of open) {
      const score = fScore.get(key) ?? Infinity;
      if (score < best) {
        best = score;
        currentKey = key;
        current = cell;
      }
    }

    if (currentKey === goalKey) {
      return reconstruct(cameFrom, currentKey, current);
    }

    open.delete(currentKey);
    closed.add(currentKey);

    for (const step of NEIGHBOURS) {
      const nx = current.x + step.x;
      const ny = current.y + step.y;
      if (!isWalkable(grid, nx, ny)) continue;

      const neighbourKey = cellKey(nx, ny);
      if (closed.has(neighbourKey)) continue;

      const tentative = (gScore.get(currentKey) ?? Infinity) + 1;
      if (tentative >= (gScore.get(neighbourKey) ?? Infinity)) continue;

      cameFrom.set(neighbourKey, currentKey);
      gScore.set(neighbourKey, tentative);
      fScore.set(neighbourKey, tentative + manhattan({ x: nx, y: ny }, goal));
      if (!open.has(neighbourKey)) {
        open.set(neighbourKey, { x: nx, y: ny });
      }
    }
  }

  return null;
};

const parseKey = (key: string): Cell => {
  const [x, y] = key.split(",");
  return { x: Number(x), y: Number(y) };
};

const reconstruct = (
  cameFrom: Map<string, string>,
  goalKey: string,
  goal: Cell,
): Cell[] => {
  const path: Cell[] = [goal];
  let key = goalKey;
  while (cameFrom.has(key)) {
    key = cameFrom.get(key) as string;
    path.push(parseKey(key));
  }
  return path.reverse();
};

/**
 * Picks a walkable cell that is at least `minDistance` away from `from`, so
 * agents are given goals worth travelling to. Falls back to any walkable cell.
 */
export const randomGoal = (
  grid: Grid,
  from: Cell,
  minDistance: number,
  random: () => number = Math.random,
): Cell => {
  const candidates: Cell[] = [];
  const fallback: Cell[] = [];

  for (let x = 0; x < grid.cols; x += 1) {
    for (let y = 0; y < grid.rows; y += 1) {
      if (!isWalkable(grid, x, y)) continue;
      const cell = { x, y };
      fallback.push(cell);
      if (manhattan(cell, from) >= minDistance) candidates.push(cell);
    }
  }

  const pool = candidates.length > 0 ? candidates : fallback;
  if (pool.length === 0) return from;
  return pool[Math.floor(random() * pool.length)];
};
