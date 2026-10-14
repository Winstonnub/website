"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const VERTEX = /* glsl */ `
  varying vec3 vDirection;

  void main() {
    // Direction from the sphere centre; the shader is sampled by view ray.
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec3 vDirection;

  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uIntensity;

  // Cheap 3D value noise. Hash is deterministic, so the sky is stable.
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
        mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x),
        f.y),
      mix(
        mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
        mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x),
        f.y),
      f.z);
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.03;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 dir = vDirection;

    // Two drifting octave stacks, layered for a cloud-within-cloud look.
    float slow = uTime * 0.012;
    float base = fbm(dir * 2.3 + vec3(slow, slow * 0.6, -slow * 0.4));
    float detail = fbm(dir * 5.1 - vec3(slow * 0.8, slow, slow * 0.5));

    float clouds = pow(clamp(base * 0.75 + detail * 0.45, 0.0, 1.0), 2.6);

    vec3 color = mix(uColorA, uColorB, clamp(detail * 1.35, 0.0, 1.0));
    color *= clouds * uIntensity;

    // Darken toward the poles so the horizon band reads as the galactic plane.
    float band = 1.0 - smoothstep(0.0, 0.85, abs(dir.y));
    color *= 0.45 + band * 0.9;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function Nebula() {
  const material = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#10224a") },
      uColorB: { value: new THREE.Color("#4a1d6b") },
      uIntensity: { value: 0.85 },
    }),
    [],
  );

  useFrame((state) => {
    const shader = material.current;
    if (shader) {
      shader.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh frustumCulled={false} scale={400}>
      <sphereGeometry args={[1, 48, 32]} />
      <shaderMaterial
        ref={material}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
