"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const STAR_COUNT = 5000;
const FIELD_RADIUS = 140;
const FIELD_DEPTH = 420;

/** Blue-white through to warm amber, weighted toward cool. */
const STAR_PALETTE = [
  new THREE.Color("#cfe6ff"),
  new THREE.Color("#a9d4ff"),
  new THREE.Color("#ffffff"),
  new THREE.Color("#ffe9c4"),
  new THREE.Color("#ffd1a1"),
  new THREE.Color("#9fe8ff"),
];

type StarGeometry = {
  points: THREE.BufferGeometry;
  streaks: THREE.BufferGeometry;
};

/**
 * Builds both representations from one set of star positions: round points for
 * the resting state, and two-vertex segments for the warp state. The segment
 * tail is displaced in the vertex shader, so at warp 0 it collapses onto the
 * head and disappears.
 */
function buildStars(): StarGeometry {
  const position = new Float32Array(STAR_COUNT * 3);
  const color = new Float32Array(STAR_COUNT * 3);
  const size = new Float32Array(STAR_COUNT);
  const phase = new Float32Array(STAR_COUNT);
  const speed = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i += 1) {
    // Distribute on a disc so the field reads as depth rather than a cube.
    const radius = FIELD_RADIUS * Math.sqrt(Math.random());
    const angle = Math.random() * Math.PI * 2;

    position[i * 3] = Math.cos(angle) * radius;
    position[i * 3 + 1] = Math.sin(angle) * radius * 0.65;
    position[i * 3 + 2] = -Math.random() * FIELD_DEPTH;

    const tint = STAR_PALETTE[Math.floor(Math.random() * STAR_PALETTE.length)];
    color[i * 3] = tint.r;
    color[i * 3 + 1] = tint.g;
    color[i * 3 + 2] = tint.b;

    // Cubic bias keeps most stars small and a few bright.
    size[i] = 0.6 + Math.pow(Math.random(), 3) * 5.2;
    phase[i] = Math.random() * Math.PI * 2;
    speed[i] = 0.4 + Math.random() * 1.6;
  }

  const points = new THREE.BufferGeometry();
  points.setAttribute("position", new THREE.BufferAttribute(position, 3));
  points.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
  points.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  points.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  points.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));

  // Streaks: duplicate every star, flagging head (0) and tail (1).
  const segPosition = new Float32Array(STAR_COUNT * 6);
  const segColor = new Float32Array(STAR_COUNT * 6);
  const segSpeed = new Float32Array(STAR_COUNT * 2);
  const segEnd = new Float32Array(STAR_COUNT * 2);

  for (let i = 0; i < STAR_COUNT; i += 1) {
    for (let v = 0; v < 2; v += 1) {
      const target = (i * 2 + v) * 3;
      segPosition[target] = position[i * 3];
      segPosition[target + 1] = position[i * 3 + 1];
      segPosition[target + 2] = position[i * 3 + 2];
      segColor[target] = color[i * 3];
      segColor[target + 1] = color[i * 3 + 1];
      segColor[target + 2] = color[i * 3 + 2];
      segSpeed[i * 2 + v] = speed[i];
      segEnd[i * 2 + v] = v;
    }
  }

  const streaks = new THREE.BufferGeometry();
  streaks.setAttribute("position", new THREE.BufferAttribute(segPosition, 3));
  streaks.setAttribute("aColor", new THREE.BufferAttribute(segColor, 3));
  streaks.setAttribute("aSpeed", new THREE.BufferAttribute(segSpeed, 1));
  streaks.setAttribute("aEnd", new THREE.BufferAttribute(segEnd, 1));

  return { points, streaks };
}

const POINT_VERTEX = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;

  uniform float uTime;
  uniform float uWarp;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    vec3 pos = position;
    // Drift stars toward the camera and wrap, so the field never empties.
    pos.z = mod(pos.z + uTime * aSpeed * 1.4, ${FIELD_DEPTH.toFixed(1)}) - ${FIELD_DEPTH.toFixed(1)};

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float twinkle = 0.75 + 0.25 * sin(uTime * 2.2 + aPhase);
    // Stars dim as they stretch into streaks.
    vAlpha = twinkle * (1.0 - uWarp * 0.85);

    gl_PointSize = aSize * uPixelRatio * (90.0 / max(-mvPosition.z, 1.0));
  }
`;

const POINT_FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Soft round falloff with a hot core.
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float glow = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.22, 0.0, d);
    vec3 shade = vColor + core * 0.6;
    gl_FragColor = vec4(shade, (glow * 0.75 + core * 0.6) * vAlpha);
  }
`;

const STREAK_VERTEX = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSpeed;
  attribute float aEnd;

  uniform float uTime;
  uniform float uWarp;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    vec3 pos = position;
    pos.z = mod(pos.z + uTime * aSpeed * 1.4, ${FIELD_DEPTH.toFixed(1)}) - ${FIELD_DEPTH.toFixed(1)};
    // Tail trails behind along the travel axis.
    pos.z -= aEnd * uWarp * aSpeed * 46.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    // Fade along the tail, and fade the whole streak out as warp ends.
    vAlpha = (1.0 - aEnd) * uWarp;
  }
`;

const STREAK_FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(vColor, vAlpha * 0.9);
  }
`;

type StarfieldProps = {
  /** 0 = at rest, 1 = full warp. Read every frame from a ref. */
  warpRef: React.RefObject<number>;
};

export default function Starfield({ warpRef }: StarfieldProps) {
  const { points, streaks } = useMemo(() => buildStars(), []);
  const pointsRef = useRef<THREE.Points>(null);
  const pointMaterial = useRef<THREE.ShaderMaterial>(null);
  const streakMaterial = useRef<THREE.ShaderMaterial>(null);

  const pointUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWarp: { value: 0 },
      uPixelRatio: {
        value: typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio, 2),
      },
    }),
    [],
  );

  const streakUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uWarp: { value: 0 } }),
    [],
  );

  useEffect(
    () => () => {
      points.dispose();
      streaks.dispose();
    },
    [points, streaks],
  );

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const warp = warpRef.current ?? 0;

    const pointShader = pointMaterial.current;
    if (pointShader) {
      pointShader.uniforms.uTime.value = time;
      pointShader.uniforms.uWarp.value = warp;
    }

    const streakShader = streakMaterial.current;
    if (streakShader) {
      streakShader.uniforms.uTime.value = time;
      streakShader.uniforms.uWarp.value = warp;
    }

    if (pointsRef.current) {
      // Barely perceptible roll keeps the field from feeling like a still.
      pointsRef.current.rotation.z = time * 0.006;
    }
  });

  return (
    <group>
      <points ref={pointsRef} geometry={points} frustumCulled={false}>
        <shaderMaterial
          ref={pointMaterial}
          vertexShader={POINT_VERTEX}
          fragmentShader={POINT_FRAGMENT}
          uniforms={pointUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments geometry={streaks} frustumCulled={false}>
        <shaderMaterial
          ref={streakMaterial}
          vertexShader={STREAK_VERTEX}
          fragmentShader={STREAK_FRAGMENT}
          uniforms={streakUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
