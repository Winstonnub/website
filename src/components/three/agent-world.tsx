"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  cellKey,
  findPath,
  isWalkable,
  randomGoal,
  toggleCell,
  type Cell,
  type Grid,
} from "@/lib/pathfinding";

const COLS = 15;
const ROWS = 11;
const CELL = 1;

const AGENT_COLORS = ["#4fd8e8", "#7c7cf0", "#49e8b0", "#e8d04f", "#f08ac0"];

/** Cell coordinates -> world position on the board plane. */
const toWorld = (cell: Cell, height = 0): THREE.Vector3 =>
  new THREE.Vector3(
    (cell.x - (COLS - 1) / 2) * CELL,
    height,
    (cell.y - (ROWS - 1) / 2) * CELL,
  );

/** World position -> nearest cell coordinates. */
const toCell = (point: THREE.Vector3): Cell => ({
  x: Math.round(point.x / CELL + (COLS - 1) / 2),
  y: Math.round(point.z / CELL + (ROWS - 1) / 2),
});

/** A scattering of walls so the board is never empty on first paint. */
const initialGrid = (): Grid => {
  const blocked = new Set<string>();
  const seeds: ReadonlyArray<readonly [number, number, number, number]> = [
    [3, 2, 1, 4],
    [7, 1, 1, 3],
    [11, 5, 1, 4],
    [5, 7, 4, 1],
    [9, 8, 3, 1],
  ];
  for (const [x, y, w, h] of seeds) {
    for (let dx = 0; dx < w; dx += 1) {
      for (let dy = 0; dy < h; dy += 1) {
        blocked.add(cellKey(x + dx, y + dy));
      }
    }
  }
  return { cols: COLS, rows: ROWS, blocked };
};

type AgentState = {
  path: Cell[];
  t: number;
  speed: number;
  goal: Cell;
  stuckFor: number;
};

const MAX_PATH_POINTS = COLS + ROWS + 2;

function Agents({ grid, count }: { grid: Grid; count: number }) {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const agents = useRef<AgentState[]>([]);
  const lastPathLength = useRef<number[]>([]);

  const colors = useMemo(
    () => Array.from({ length: count }, (_, i) => AGENT_COLORS[i % AGENT_COLORS.length]),
    [count],
  );

  // Line geometries are allocated once at max length and redrawn via drawRange.
  const geometries = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(MAX_PATH_POINTS * 3), 3),
        );
        geometry.setDrawRange(0, 0);
        return geometry;
      }),
    [count],
  );

  // `<line>` in JSX resolves to the SVG element, so the path lines are built as
  // plain three.js objects and mounted with <primitive>.
  const pathLines = useMemo(
    () =>
      geometries.map(
        (geometry, index) =>
          new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
              color: new THREE.Color(colors[index]),
              transparent: true,
              opacity: 0.45,
            }),
          ),
      ),
    [geometries, colors],
  );

  useEffect(
    () => () => {
      pathLines.forEach((line) => (line.material as THREE.Material).dispose());
      geometries.forEach((geometry) => geometry.dispose());
    },
    [geometries, pathLines],
  );

  const replan = useCallback(
    (agent: AgentState, from: Cell, currentGrid: Grid): AgentState => {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const goal = randomGoal(currentGrid, from, 6);
        const path = findPath(currentGrid, from, goal);
        if (path && path.length > 1) {
          return { ...agent, path, goal, t: 0, stuckFor: 0 };
        }
      }
      return { ...agent, path: [from], t: 0, stuckFor: 0 };
    },
    [],
  );

  // Seeds agents on mount, and re-plans all of them whenever the walls change.
  // The frame loop simply skips until this has run.
  useEffect(() => {
    if (agents.current.length === count) {
      agents.current = agents.current.map((agent) => {
        const here = agent.path[0] ?? agent.goal;
        const from = isWalkable(grid, here.x, here.y)
          ? here
          : randomGoal(grid, here, 0);
        return replan(agent, from, grid);
      });
    } else {
      agents.current = Array.from({ length: count }, (_, i) => {
        const start: Cell = {
          x: Math.round(((i + 1) / (count + 1)) * (COLS - 1)),
          y: i % 2 === 0 ? 0 : ROWS - 1,
        };
        const from = isWalkable(grid, start.x, start.y)
          ? start
          : randomGoal(grid, start, 0);
        return replan(
          { path: [from], t: 0, speed: 1.6 + (i % 3) * 0.35, goal: from, stuckFor: 0 },
          from,
          grid,
        );
      });
    }

    lastPathLength.current = agents.current.map(() => -1);
  }, [grid, count, replan]);

  useFrame((_, delta) => {
    const step = Math.min(delta, 1 / 30);

    agents.current = agents.current.map((agent, index) => {
      let next = agent;

      if (next.path.length < 2) {
        next = { ...next, stuckFor: next.stuckFor + step };
        if (next.stuckFor > 0.4) {
          next = replan(next, next.path[0] ?? next.goal, grid);
        }
      } else {
        const t = next.t + step * next.speed;
        if (t >= 1) {
          next = { ...next, path: next.path.slice(1), t: t - 1 };
        } else {
          next = { ...next, t };
        }
      }

      const mesh = meshes.current[index];
      if (mesh) {
        const from = next.path[0] ?? next.goal;
        const to = next.path[1] ?? from;
        const position = toWorld(from, 0.26).lerp(toWorld(to, 0.26), next.t);
        mesh.position.copy(position);
        // Gentle bob so stationary agents still read as alive.
        mesh.position.y += Math.sin(performance.now() / 420 + index) * 0.03;
      }

      const line = pathLines[index];
      if (line && next.path.length !== lastPathLength.current[index]) {
        const attribute = line.geometry.getAttribute("position") as THREE.BufferAttribute;
        const points = Math.min(next.path.length, MAX_PATH_POINTS);
        for (let p = 0; p < points; p += 1) {
          const world = toWorld(next.path[p], 0.08);
          attribute.setXYZ(p, world.x, world.y, world.z);
        }
        attribute.needsUpdate = true;
        line.geometry.setDrawRange(0, points);
        lastPathLength.current[index] = next.path.length;
      }

      return next;
    });
  });

  return (
    <group>
      {colors.map((color, index) => (
        <group key={index}>
          <mesh ref={(node) => void (meshes.current[index] = node)} castShadow={false}>
            <sphereGeometry args={[0.2, 20, 20]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.5}
              roughness={0.25}
              metalness={0.1}
            />
          </mesh>
          <primitive object={pathLines[index]} />
        </group>
      ))}
    </group>
  );
}

function Wall({ cell }: { cell: Cell }) {
  const mesh = useRef<THREE.Mesh>(null);
  const grown = useRef(0);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    grown.current = Math.min(1, grown.current + delta * 4);
    const eased = 1 - Math.pow(1 - grown.current, 3);
    mesh.current.scale.y = Math.max(0.001, eased);
    mesh.current.position.y = (eased * 0.42) / 2;
  });

  const base = toWorld(cell);

  return (
    <mesh ref={mesh} position={[base.x, 0, base.z]}>
      <boxGeometry args={[CELL * 0.86, 0.42, CELL * 0.86]} />
      <meshStandardMaterial
        color="#1b2430"
        emissive="#2d4455"
        emissiveIntensity={0.45}
        roughness={0.55}
        metalness={0.2}
      />
    </mesh>
  );
}

function Board({
  grid,
  onToggle,
}: {
  grid: Grid;
  onToggle: (cell: Cell) => void;
}) {
  const [hovered, setHovered] = useState<Cell | null>(null);

  const gridLines = useMemo(() => {
    const points: number[] = [];
    const halfW = (COLS * CELL) / 2;
    const halfH = (ROWS * CELL) / 2;
    for (let x = 0; x <= COLS; x += 1) {
      const px = -halfW + x * CELL;
      points.push(px, 0, -halfH, px, 0, halfH);
    }
    for (let y = 0; y <= ROWS; y += 1) {
      const pz = -halfH + y * CELL;
      points.push(-halfW, 0, pz, halfW, 0, pz);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geometry;
  }, []);

  useEffect(() => () => gridLines.dispose(), [gridLines]);

  const handleMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    setHovered(toCell(event.point));
  }, []);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      onToggle(toCell(event.point));
    },
    [onToggle],
  );

  const walls = useMemo(
    () =>
      Array.from(grid.blocked).map((key) => {
        const [x, y] = key.split(",").map(Number);
        return { key, cell: { x, y } };
      }),
    [grid.blocked],
  );

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={handleMove}
        onPointerOut={() => setHovered(null)}
        onClick={handleClick}
      >
        <planeGeometry args={[COLS * CELL, ROWS * CELL]} />
        <meshStandardMaterial color="#0f1620" roughness={0.9} metalness={0} />
      </mesh>

      <lineSegments geometry={gridLines} position={[0, 0.005, 0]}>
        <lineBasicMaterial color="#51708a" transparent opacity={0.7} />
      </lineSegments>

      {hovered && (
        <mesh
          position={[toWorld(hovered).x, 0.012, toWorld(hovered).z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[CELL * 0.9, CELL * 0.9]} />
          <meshBasicMaterial color="#4fd8e8" transparent opacity={0.22} />
        </mesh>
      )}

      {walls.map(({ key, cell }) => (
        <Wall key={key} cell={cell} />
      ))}
    </group>
  );
}

/**
 * Aims the camera slightly in front of the board's centre. Looking straight at
 * the origin pushes the near rows past the bottom of the canvas, because the
 * board's angular span is not symmetric about that axis.
 */
function CameraRig() {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    camera.lookAt(0, 0, 1.4);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

/** Tilts the whole board a few degrees toward the cursor. */
function ParallaxRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      target.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const lerp = Math.min(1, delta * 2.5);
    group.current.rotation.y += (target.current.x * 0.09 - group.current.rotation.y) * lerp;
    group.current.rotation.x += (target.current.y * 0.035 - group.current.rotation.x) * lerp;
  });

  return <group ref={group}>{children}</group>;
}

export default function AgentWorld({ compact = false }: { compact?: boolean }) {
  const [grid, setGrid] = useState<Grid>(initialGrid);
  const [interacted, setInteracted] = useState(false);

  const handleToggle = useCallback((cell: Cell) => {
    setInteracted(true);
    setGrid((current) => toggleCell(current, cell.x, cell.y));
  }, []);

  const reset = useCallback(() => {
    setGrid(initialGrid());
    setInteracted(false);
  }, []);

  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 12.5, 10], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0b1016"]} />
        <fog attach="fog" args={["#0b1016", 20, 38]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 12, 6]} intensity={0.8} />
        <pointLight position={[-8, 6, -6]} intensity={28} color="#4fd8e8" distance={26} />
        <pointLight position={[8, 5, 8]} intensity={20} color="#7c7cf0" distance={26} />
        <CameraRig />
        <ParallaxRig>
          <group rotation={[0, 0, 0]}>
            <Board grid={grid} onToggle={handleToggle} />
            <Agents grid={grid} count={compact ? 3 : 5} />
          </group>
        </ParallaxRig>
      </Canvas>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0b1016] via-[#0b1016]/80 to-transparent"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <p className="mono text-[11px] leading-relaxed text-muted-foreground">
          {interacted ? (
            <>
              <span className="text-primary">{grid.blocked.size}</span> walls · agents re-planning
            </>
          ) : (
            <>Click the grid to drop a wall — the agents re-plan around it</>
          )}
        </p>
        {interacted && (
          <button
            type="button"
            onClick={reset}
            className="pointer-events-auto mono rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-foreground"
          >
            reset
          </button>
        )}
      </div>
    </div>
  );
}
