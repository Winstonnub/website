"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import Nebula from "./nebula";
import Starfield from "./starfield";

/**
 * Moves the camera from scroll position and pointer, with critically-damped
 * easing so neither input feels twitchy.
 */
function CameraRig({ warpRef }: { warpRef: React.RefObject<number> }) {
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointer.current = {
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
      };
    };

    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };

    onScroll();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((state, delta) => {
    // `state.camera` is the live object the renderer reads each frame; driving
    // it directly is how r3f animates, and keeps this off the React render path.
    const camera = state.camera as THREE.PerspectiveCamera;
    const ease = 1 - Math.pow(0.001, delta);
    const warp = warpRef.current ?? 0;

    // Scrolling the page flies the camera deeper into the field.
    const targetZ = 10 - scroll.current * 26 - warp * 10;
    const targetX = pointer.current.x * 4;
    const targetY = -pointer.current.y * 2.4;

    camera.position.x += (targetX - camera.position.x) * ease;
    camera.position.y += (targetY - camera.position.y) * ease;
    camera.position.z += (targetZ - camera.position.z) * ease;

    camera.lookAt(
      pointer.current.x * 1.5,
      -pointer.current.y * 0.9,
      camera.position.z - 30,
    );
    // Applied after lookAt, which rewrites rotation wholesale. A slow roll
    // tied to scroll gives the sense of banking through the field.
    camera.rotation.z = scroll.current * 0.16;

    // Widen the lens during warp for a bit of extra rush.
    const targetFov = 62 + warp * 26;
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov += (targetFov - camera.fov) * ease;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

export default function CosmosScene({
  warpRef,
}: {
  warpRef: React.RefObject<number>;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 10], fov: 62, near: 0.1, far: 1200 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#05060c"]} />
        <Nebula />
        <Starfield warpRef={warpRef} />
        <CameraRig warpRef={warpRef} />
      </Canvas>
    </div>
  );
}
