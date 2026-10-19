useGLTF.preload(
  "/assets/sleepy_panda_draco.glb",
  "/draco/"
);

useGLTF.preload(
  "/assets/unicorn_music_box_draco.glb",
  "/draco/"
);

useGLTF.preload(
  "/assets/moon-night-light_draco.glb",
  "/draco/"
);
import SplashCursor from "./DreamCursor";
import React, { Suspense, useEffect, useRef , useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Cloud,
  Float,
  Sparkles,
  Stars,
  MeshDistortMaterial,
  Text,
  useGLTF,
} from "@react-three/drei";

import * as THREE from "three";
import "./App.css";




function FloatingIsland() {
  const islandRef = useRef();

  const rockGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1, 64, 48);
    const positions = geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);

      const variation =
        1 +
        0.055 * Math.sin(x * 9 + z * 4) * Math.cos(y * 8) +
        0.025 * Math.sin(z * 13 + y * 5);

      positions.setXYZ(
        i,
        x * variation,
        y * variation,
        z * variation
      );
    }

    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Keep the island anchored in the world.
  // The camera, not the island, controls the journey.



useFrame(() => {
  if (!islandRef.current) return;

  islandRef.current.position.set(0, -0.35, -1);
  islandRef.current.scale.setScalar(0.8);
  islandRef.current.rotation.y = 0;
});

  return (
    <group ref={islandRef} position={[0, -0.35, -1]}>
      {/* Rocky floating underside */}
      <mesh position={[0, -0.7, 0]} scale={[2.2, 1.35, 1.7]}>
        <dodecahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color="#66577f"
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* Naturally shaped floating rock */}
      <mesh
        geometry={rockGeometry}
        position={[0, -0.7, 0]}
        scale={[2.2, 1.35, 1.7]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#62536f"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* Island plateau */}
      <mesh position={[0, 0.03, 0]} scale={[2.05, 0.18, 1.62]}>
        <cylinderGeometry args={[1, 1, 0.3, 48]} />
        <meshStandardMaterial
          color="#829b91"
          roughness={0.95}
          flatShading
        />
      </mesh>

      {/* Grassy surface */}
      <mesh position={[0, 0.16, 0]} scale={[1.98, 0.08, 1.55]}>
        <cylinderGeometry args={[1, 1, 0.12, 48]} />
        <meshStandardMaterial
          color="#a8c3a7"
          roughness={1}
        />
      </mesh>

      {/* Castle */}
      <group position={[0, 0.25, -0.2]}>
        {/* Main building */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.9, 0.9, 0.7]} />
          <meshStandardMaterial
            color="#cbb7e9"
            roughness={0.7}
          />
        </mesh>

        {/* Main roof */}
        <mesh position={[0, 1.05, 0]}>
          <coneGeometry args={[0.65, 0.55, 4]} />
          <meshStandardMaterial
            color="#e99dd5"
            roughness={0.55}
            emissive="#713c86"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Castle towers */}
        {[-0.68, 0.68].map((x, i) => (
          <group key={`tower-${i}`} position={[x, 0.05, 0]}>
            <mesh position={[0, 0.43, 0]}>
              <cylinderGeometry args={[0.16, 0.2, 0.86, 10]} />
              <meshStandardMaterial color="#e0d0f4" />
            </mesh>

            <mesh position={[0, 0.97, 0]}>
              <coneGeometry args={[0.25, 0.5, 8]} />
              <meshStandardMaterial
                color="#91ddf2"
                emissive="#45b6df"
                emissiveIntensity={0.65}
              />
            </mesh>

            {/* Tower window */}
            <mesh position={[0, 0.43, 0.19]}>
              <boxGeometry args={[0.07, 0.15, 0.025]} />
              <meshBasicMaterial color="#fff1b5" />
            </mesh>
          </group>
        ))}

        {/* Main windows */}
        {[-0.22, 0.22].map((x, i) => (
          <mesh key={`window-${i}`} position={[x, 0.45, 0.36]}>
            <boxGeometry args={[0.1, 0.19, 0.025]} />
            <meshBasicMaterial color="#ffe7a6" />
          </mesh>
        ))}

        {/* Entrance */}
        <mesh position={[0, 0.15, 0.36]}>
          <boxGeometry args={[0.17, 0.34, 0.03]} />
          <meshBasicMaterial color="#624a83" />
        </mesh>
      </group>

      {/* Floating magical crystals */}
      {[
        [-1.5, 0.45, 0.45],
        [1.45, 0.55, -0.15],
        [0.95, 0.35, 0.85],
      ].map((position, i) => (
        <Float
          key={`crystal-${i}`}
          speed={1.1 + i * 0.25}
          rotationIntensity={0.65}
          floatIntensity={0.7}
        >
          <mesh position={position} scale={0.13}>
            <octahedronGeometry args={[1]} />
            <meshStandardMaterial
              color={i === 1 ? "#ffc2e7" : "#a4e9ff"}
              emissive={i === 1 ? "#f16ac9" : "#49b9ff"}
              emissiveIntensity={1.2}
              roughness={0.25}
            />
          </mesh>
        </Float>
      ))}

      {/* Golden particles around the island */}
      <Sparkles
        position={[0, 0.6, 0]}
        count={35}
        scale={[4.2, 1.5, 3.2]}
        size={1.6}
        speed={0.35}
        color="#ffe5a8"
      />
    </group>
  );
}





function DreamClouds() {
  const cloudsRef = useRef();

  
useFrame((state) => {
  if (!cloudsRef.current) return;

  const t = state.clock.elapsedTime;

  cloudsRef.current.position.x = Math.sin(t * 0.08) * 0.25;
  cloudsRef.current.position.y = Math.sin(t * 0.12) * 0.08;

  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress =
    maxScroll > 0
      ? THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1)
      : 0;

  // Gradually clear the clouds as the camera enters the nursery.
  const roomReveal = THREE.MathUtils.smoothstep(
    progress,
    0.42,
    0.72
  );

  cloudsRef.current.children.forEach((cloud) => {
    cloud.visible = roomReveal < 0.98;
    cloud.traverse((object) => {
      if (!object.material) return;

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => {
        if (material.userData.baseCloudOpacity === undefined) {
          material.userData.baseCloudOpacity = material.opacity;
        }

        material.opacity =
          material.userData.baseCloudOpacity * (1 - roomReveal * 0.85);
      });
    });
  });
});


  return (
    <group ref={cloudsRef}>
      {/* Distant lavender cloud banks */}
      <Cloud
        position={[-5.5, -0.4, -7]}
        bounds={[7, 2.2, 2.5]}
        segments={30}
        volume={5}
        color="#a5b9f4"
        opacity={0.55}
        speed={0.08}
        fade={12}
      />

      <Cloud
        position={[5.5, -0.7, -6]}
        bounds={[7, 2.5, 2.5]}
        segments={30}
        volume={5}
        color="#c6a8f0"
        opacity={0.55}
        speed={0.08}
        fade={12}
      />

      {/* Pink clouds behind the island */}
      <Cloud
        position={[-3.8, -1.5, -3.5]}
        bounds={[5, 2, 2]}
        segments={28}
        volume={4}
        color="#f0b8e8"
        opacity={0.72}
        speed={0.12}
        fade={10}
      />

      <Cloud
        position={[4.2, -1.4, -3]}
        bounds={[5.5, 2.1, 2.5]}
        segments={28}
        volume={4}
        color="#bcb8f7"
        opacity={0.7}
        speed={0.1}
        fade={10}
      />

      {/* Mid-distance cloud layers */}
      <Cloud
        position={[-6, -2.1, 0]}
        bounds={[5, 1.7, 2.5]}
        segments={24}
        volume={4}
        color="#edc4f0"
        opacity={0.76}
        speed={0.12}
        fade={8}
      />

      <Cloud
        position={[5.8, -2, 0.5]}
        bounds={[5, 1.7, 2.5]}
        segments={24}
        volume={4}
        color="#c3c6ff"
        opacity={0.76}
        speed={0.12}
        fade={8}
      />

      {/* Foreground clouds framing the view */}
      <Cloud
        position={[-5, -3.2, 3]}
        bounds={[5, 2, 2.5]}
        segments={24}
        volume={3}
        color="#f6c5e8"
        opacity={0.8}
        speed={0.16}
        fade={7}
      />

      <Cloud
        position={[5, -3, 3.5]}
        bounds={[5, 2, 2.5]}
        segments={24}
        volume={3}
        color="#c9c4ff"
        opacity={0.8}
        speed={0.15}
        fade={7}
      />

      {/* Small wisps floating through the scene */}
      <Cloud
        position={[-1.8, 1.6, -5]}
        bounds={[2.5, 0.7, 1]}
        segments={16}
        volume={2}
        color="#f6dcff"
        opacity={0.4}
        speed={0.08}
        fade={7}
      />

      <Cloud
        position={[2.2, 1.8, -4]}
        bounds={[2.5, 0.7, 1]}
        segments={16}
        volume={2}
        color="#c3dfff"
        opacity={0.42}
        speed={0.08}
        fade={7}
      />
    </group>
  );
}


function Portal() {
  return (
    <group position={[0, 0.35, -1.5]}>
      <mesh>
        <torusGeometry args={[1.2, 0.055, 16, 120]} />
        <meshStandardMaterial
          color="#a7f0ff"
          emissive="#53bfff"
          emissiveIntensity={3}
          metalness={0.25}
          roughness={0.25}
        />
      </mesh>
      <mesh scale={[0.96, 0.96, 0.96]}>
        <circleGeometry args={[1.14, 64]} />
        <MeshDistortMaterial
          color="#a88bff"
          emissive="#694bda"
          emissiveIntensity={0.65}
          transparent
          opacity={0.17}
          distort={0.2}
          speed={1.3}
        />
      </mesh>
      <Sparkles
        count={100}
        scale={[3.5, 4.2, 1]}
        size={2.4}
        speed={0.35}
        color="#d7caff"
        opacity={0.9}
      />
    </group>
  );
}



function CameraJourney() {
  useFrame(({ camera }) => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    const globalProgress =
      maxScroll > 0
        ? THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1)
        : 0;

    // Preserve the existing journey through the first three sections.
    // Assumes the four story sections have equal viewport heights.
   const progress = THREE.MathUtils.clamp(
  globalProgress / 0.8,
  0,
  1
);

    const mobile = window.innerWidth <= 700;

    // EXISTING APPROACH AND DIVE
    const approach = THREE.MathUtils.smoothstep(
      progress, 0.08, 0.38
    );

    const dive = THREE.MathUtils.smoothstep(
      progress, 0.38, 0.82
    );

    const startZ = mobile ? 12 : 10;
    const islandZ = mobile ? 6 : 5.2;
    const nurseryZ = mobile ? -1.2 : -2.5;

    const originalZ = THREE.MathUtils.lerp(
      THREE.MathUtils.lerp(startZ, islandZ, approach),
      nurseryZ,
      dive
    );

    const originalY = THREE.MathUtils.lerp(
      mobile ? 0.8 : 0.65,
      0,
      dive
    );

    const originalTargetZ = THREE.MathUtils.lerp(-1, -5, dive);
    const originalTargetY = THREE.MathUtils.lerp(-0.35, 0.1, dive);

    // EXISTING RIGHT TURN INTO THE WORKSHOP
    const turn = THREE.MathUtils.smoothstep(
      progress, 0.82, 0.91
    );

    const enterRoom = THREE.MathUtils.smoothstep(
      progress, 0.89, 1
    );

    const baseCameraX = THREE.MathUtils.lerp(
      0,
      mobile ? 4.0 : 3.2,
      turn
    );

    const baseCameraZ = THREE.MathUtils.lerp(
      originalZ,
      mobile ? -3.5 : -4.5,
      enterRoom
    );

    const baseCameraY = THREE.MathUtils.lerp(
      originalY,
      0.05,
      enterRoom
    );

    const forwardTarget = new THREE.Vector3(
      0, originalTargetY, originalTargetZ
    );

    const workshopTarget = new THREE.Vector3(4.5, 0, -7.5);

    const baseTarget = forwardTarget.lerp(
      workshopTarget,
      turn
    );

    // NEW PHASE: continue from the workshop to DREAMCAPTURE.
    // This phase begins only after the existing journey finishes.
    const captureProgress = THREE.MathUtils.smoothstep(
  globalProgress,
  0.8,
  1
);

    const finalCameraPosition = new THREE.Vector3(
      mobile ? 8.8 : 8.5,
      0.15,
      mobile ? -5.8 : -5.5
    );

    const currentCameraPosition = new THREE.Vector3(
      baseCameraX,
      baseCameraY,
      baseCameraZ
    );

    currentCameraPosition.lerp(
      finalCameraPosition,
      captureProgress
    );

    const captureTarget = new THREE.Vector3(10.5, 0, -8.5);

    const finalTarget = baseTarget.lerp(
      captureTarget,
      captureProgress
    );

    camera.position.copy(currentCameraPosition);
    camera.fov = mobile ? 58 : 45;
    camera.updateProjectionMatrix();
    camera.lookAt(finalTarget);
  });

  return null;
}


function TransitionMist() {
  const mistRef = useRef();

  useFrame(({ clock }) => {
    if (!mistRef.current) return;

    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress =
      maxScroll > 0
        ? THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1)
        : 0;

    // Mist enters, peaks, then clears as the room is revealed.
    const enter = THREE.MathUtils.smoothstep(progress, 0.30, 0.48);
    const clear = THREE.MathUtils.smoothstep(progress, 0.49, 0.68);
    const opacity = enter * (1 - clear);

    mistRef.current.visible = opacity > 0.01;
    mistRef.current.position.x =
      Math.sin(clock.elapsedTime * 0.22) * 0.18;
    mistRef.current.position.y =
      Math.sin(clock.elapsedTime * 0.35) * 0.08;

    mistRef.current.children.forEach((cloud, i) => {
      cloud.material.opacity = opacity * (0.28 + (i % 3) * 0.08);
      cloud.position.x =
        Math.sin(clock.elapsedTime * 0.2 + i) * 0.18;
    });
  });

  return (
    <group ref={mistRef} position={[0, 0, 1.5]}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[
            (i % 3 - 1) * 1.8,
            Math.floor(i / 3) * 0.9 - 0.45,
            -i * 0.12,
          ]}
          scale={[2.8, 1.25, 0.18]}
        >
          <sphereGeometry args={[1, 24, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}



function PipModel({ pandaRef }) {
  const { scene } = useGLTF(
  "/assets/sleepy_panda_draco.glb",
  "/draco/"
);

  const mouse = useRef({ x: 0, y: 0 });

  const pandaModel = useMemo(() => {
    const model = scene.clone(true);

    // Calculate model dimensions and scale Pip.
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);

    if (maxDimension > 0) {
      model.scale.setScalar(1.5 / maxDimension);
    }

    // Center the model around its origin.
    const adjustedBounds = new THREE.Box3().setFromObject(model);
    const center = adjustedBounds.getCenter(new THREE.Vector3());

    model.position.set(-center.x, -center.y, -center.z);

    return model;
  }, [scene]);

  // Track the mouse position.
  
useEffect(() => {
  const handlePointerMove = (event) => {
    mouse.current.x =
      (event.clientX / window.innerWidth) * 2 - 1;

    mouse.current.y =
      (event.clientY / window.innerHeight) * 2 - 1;
  };

  window.addEventListener("pointermove", handlePointerMove, {
    passive: true,
  });

  return () => {
    window.removeEventListener("pointermove", handlePointerMove);
  };
}, []);


  useFrame(({ clock }) => {
    if (!pandaRef.current) return;

    

    const time = clock.elapsedTime;

    // Gentle floating animation.
    pandaRef.current.position.y =
      0.85 + Math.sin(time * 1.5) * 0.035;

    // Smooth mouse-following movement.
    const targetRotationY = -0.25 + mouse.current.x * 0.35;
    const targetRotationX = mouse.current.y * 0.12;
    const targetLean = -mouse.current.x * 0.08;

    pandaRef.current.rotation.y = THREE.MathUtils.lerp(
      pandaRef.current.rotation.y,
      targetRotationY,
      0.06
    );

    pandaRef.current.rotation.x = THREE.MathUtils.lerp(
      pandaRef.current.rotation.x,
      targetRotationX,
      0.06
    );

    pandaRef.current.rotation.z = THREE.MathUtils.lerp(
      pandaRef.current.rotation.z,
      targetLean,
      0.06
    );
  });

  return (
    <group
      ref={pandaRef}
      position={[0.25, 0.85, 0.05]}
      rotation={[0, -0.25, 0]}
    >
      <primitive object={pandaModel} />
    </group>
  );
}



// Keep PipsNursery() below this function.
function PipsNursery() {
   const roomRef = useRef();
  const pandaRef = useRef();

  useFrame(() => {
    if (!roomRef.current) return;

    roomRef.current.position.set(0, 0, -5);
    roomRef.current.scale.setScalar(1);
  });

  return (
    <group ref={roomRef} position={[0, 0, -5]}>
      {/* Back wall */}
      <mesh position={[0, 2.2, -2.2]}>
        <boxGeometry args={[8, 5, 0.2]} />
        <meshStandardMaterial color="#d9c8f2" />
      </mesh>

      {/* Floor */}
      <mesh
        position={[0, -1.25, -0.1]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial
          color="#b9a2d4"
          roughness={0.85}
        />
      </mesh>

    
      {/* Moonlit circular window */}
      <group position={[-1.9, 1.35, -2.04]}>
        <mesh>
          <circleGeometry args={[0.85, 64]} />
          <meshBasicMaterial color="#bde9ff" />
        </mesh>

        <mesh position={[0, 0, 0.025]}>
          <ringGeometry args={[0.86, 0.98, 64]} />
          <meshStandardMaterial
            color="#f6e6ff"
            emissive="#bca7ff"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Window crossbars */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.045, 1.65, 0.04]} />
          <meshStandardMaterial color="#f8eaff" />
        </mesh>

        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[1.65, 0.045, 0.04]} />
          <meshStandardMaterial color="#f8eaff" />
        </mesh>

        {/* Moon */}
        <mesh position={[0.28, 0.27, 0.07]}>
          <circleGeometry args={[0.24, 48]} />
          <meshBasicMaterial color="#fff7d6" />
        </mesh>

        <pointLight
          position={[0, 0, 0.5]}
          color="#9bdfff"
          intensity={1.5}
          distance={5}
        />
      </group>

      {/* Bed */}
      <group position={[0.4, -0.72, 0.15]}>
        {/* Bed frame */}
        <mesh position={[0, -0.18, 0]}>
          <boxGeometry args={[3.3, 0.28, 1.65]} />
          <meshStandardMaterial
            color="#76548e"
            roughness={0.65}
          />
        </mesh>

        {/* Headboard */}
        <mesh position={[0, 0.2, -0.68]}>
          <boxGeometry args={[3.3, 0.85, 0.16]} />
          <meshStandardMaterial color="#8f6bab" />
        </mesh>

        {/* Mattress */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[3.05, 0.2, 1.45]} />
          <meshStandardMaterial
            color="#f2eaff"
            roughness={0.95}
          />
        </mesh>

        {/* Blanket */}
        <mesh position={[0.15, 0.15, 0.18]}>
          <boxGeometry args={[2.35, 0.09, 1.05]} />
          <meshStandardMaterial
            color="#a6c8f5"
            roughness={1}
          />
        </mesh>

        {/* Pillow */}
        <mesh position={[-0.95, 0.17, -0.36]}>
          <boxGeometry args={[0.72, 0.15, 0.55]} />
          <meshStandardMaterial color="#fff6df" />
        </mesh>

        {/* Pip's 3D model */}
    
        {/* Pip's 3D model */}
<Suspense fallback={null}>
  <PipModel pandaRef={pandaRef} />
</Suspense>
      </group>

      {/* Bedside table and lamp */}
      <group position={[2.45, -0.65, -0.45]}>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.85, 0.12, 0.75]} />
          <meshStandardMaterial color="#a783bd" />
        </mesh>

        <mesh position={[-0.27, -0.15, 0]}>
          <boxGeometry args={[0.09, 0.65, 0.09]} />
          <meshStandardMaterial color="#89649f" />
        </mesh>

        <mesh position={[0.27, -0.15, 0]}>
          <boxGeometry args={[0.09, 0.65, 0.09]} />
          <meshStandardMaterial color="#89649f" />
        </mesh>

        {/* Lamp base */}
        <mesh position={[0, 0.36, 0]}>
          <cylinderGeometry args={[0.16, 0.2, 0.08, 24]} />
          <meshStandardMaterial color="#f7dca4" />
        </mesh>

        {/* Lamp shade */}
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.12, 0.3, 0.42, 32]} />
          <meshStandardMaterial
            color="#fff0c9"
            emissive="#ffd98b"
            emissiveIntensity={0.7}
          />
        </mesh>

        <pointLight
          position={[0, 0.62, 0.05]}
          color="#ffd995"
          intensity={1.3}
          distance={3}
        />
      </group>

      {/* Bookshelf */}
      <group position={[-3.15, -0.35, -1.1]}>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.95, 2.4, 0.5]} />
          <meshStandardMaterial color="#8e6da9" />
        </mesh>

        {[0.15, 0.75, 1.35].map((y, index) => (
          <mesh key={index} position={[0, y, 0.27]}>
            <boxGeometry args={[0.92, 0.07, 0.56]} />
            <meshStandardMaterial color="#e9d7f5" />
          </mesh>
        ))}

        {/* Books */}
        {[
          ["#e7a8ca", -0.27, 0.4],
          ["#9fc8ed", -0.06, 0.48],
          ["#f4d68b", 0.15, 0.36],
          ["#b9a6ed", 0.34, 0.44],
        ].map(([color, x, height], index) => (
          <mesh
            key={index}
            position={[x, 0.22 + height / 2, 0.28]}
          >
            <boxGeometry args={[0.16, height, 0.22]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ))}
      </group>

      {/* Soft rug */}
      <mesh
        position={[0.3, -1.225, 0.65]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[1.45, 64]} />
        <meshStandardMaterial
          color="#e7c9f3"
          roughness={1}
        />
      </mesh>

      {/* Floating dream particles */}
      <Sparkles
        count={45}
        position={[0, 0.7, 0]}
        scale={[5.5, 3.5, 3]}
        size={2}
        speed={0.25}
        color="#fff1c9"
      />

      {/* Ambient nursery lighting */}
      <pointLight
        position={[0, 1.8, 1.2]}
        color="#d8c4ff"
        intensity={1.1}
        distance={9}
      />

      <ambientLight intensity={0.65} color="#e9dfff" />
    </group>
  );
}

function normalizeDreamModel(sourceScene, targetSize = 1.4) {
  const model = sourceScene.clone(true);

  const initialBounds = new THREE.Box3().setFromObject(model);
  const initialSize = initialBounds.getSize(new THREE.Vector3());
  const maxDimension = Math.max(
    initialSize.x,
    initialSize.y,
    initialSize.z
  );

  if (maxDimension > 0) {
    model.scale.setScalar(targetSize / maxDimension);
  }

  const bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());
  model.position.sub(center);

  return model;
}



function DreamWorkshopModels() {
 const { scene: musicBoxSource } = useGLTF(
  "/assets/unicorn_music_box_draco.glb",
  "/draco/"
);

const { scene: moonLightSource } = useGLTF(
  "/assets/moon-night-light_draco.glb",
  "/draco/"
);

  const musicBox = useMemo(
    () => normalizeDreamModel(musicBoxSource, 1.35),
    [musicBoxSource]
  );

  const moonLight = useMemo(
    () => normalizeDreamModel(moonLightSource, 1.35),
    [moonLightSource]
  );

  return (
    <group position={[5.5, 0, -5.5]}>
      {/* Open display platform */}
      <mesh
        position={[0, -1.25, -0.3]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[4.5, 64]} />
        <meshStandardMaterial
          color="#b7a1d7"
          roughness={0.85}
        />
      </mesh>

      {/* Glowing entrance portal */}
      <group position={[-1.7, 0.1, 0.2]}>
        <mesh>
          <torusGeometry args={[1.25, 0.06, 16, 80]} />
          <meshStandardMaterial
            color="#c9b3ff"
            emissive="#936cff"
            emissiveIntensity={2.5}
          />
        </mesh>
        <Sparkles
          count={40}
          scale={[3, 3, 1]}
          size={2}
          speed={0.4}
          color="#fff0ca"
        />
      </group>

      {/* Project 1: Music box */}
      <Float speed={1} floatIntensity={0.12}>
        <group position={[-1.35, 0, -1.6]}>
          <mesh position={[0, -0.72, 0]}>
            <cylinderGeometry args={[0.82, 0.94, 0.28, 48]} />
            <meshStandardMaterial color="#b99bdb" />
          </mesh>
          <primitive object={musicBox} position={[0, 0.12, 0]} />
          <Text
            position={[0, -1.08, 0.1]}
            fontSize={0.16}
            color="#fff4ff"
            anchorX="center"
          >
            LULLABY LAB
          </Text>
        </group>
      </Float>

      {/* Project 2: Moon nightlight */}
      <Float speed={0.8} floatIntensity={0.12}>
        <group position={[1.35, 0, -1.6]}>
          <mesh position={[0, -0.72, 0]}>
            <cylinderGeometry args={[0.82, 0.94, 0.28, 48]} />
            <meshStandardMaterial color="#9eaddd" />
          </mesh>
          <primitive object={moonLight} position={[0, 0.12, 0]} />
          <pointLight
            position={[0, 0.4, 0.4]}
            color="#ffdba0"
            intensity={1.5}
            distance={4}
          />
          <Text
            position={[0, -1.08, 0.1]}
            fontSize={0.14}
            color="#fff4ff"
            anchorX="center"
          >
            NIGHTLIGHT COLLECTION
          </Text>
        </group>
      </Float>

      {/* Project 3: Constellation */}
      <group position={[0, 0.2, -3]}>
        <mesh>
          <torusGeometry args={[0.75, 0.04, 12, 48]} />
          <meshStandardMaterial
            color="#ffe4a6"
            emissive="#ffc96f"
            emissiveIntensity={1.5}
          />
        </mesh>
        {[
          [0, 0.75, 0],
          [-0.55, 0.2, 0],
          [0.5, -0.12, 0],
          [-0.12, -0.48, 0],
        ].map((point, i) => (
          <mesh key={i} position={point}>
            <icosahedronGeometry args={[0.09, 1]} />
            <meshStandardMaterial
              color="#fff0bd"
              emissive="#ffd87b"
              emissiveIntensity={1.4}
            />
          </mesh>
        ))}
        <Text
          position={[0, -1, 0.1]}
          fontSize={0.15}
          color="#fff4ff"
          anchorX="center"
        >
          DREAM DELIVERY ROUTES
        </Text>
      </group>

      <pointLight
        position={[0, 2, 0]}
        color="#dfc6ff"
        intensity={2.5}
        distance={12}
      />

      <Sparkles
        count={100}
        position={[0, 0.8, -1.5]}
        scale={[8, 4, 6]}
        size={1.6}
        speed={0.22}
        color="#f8e8ff"
      />
    </group>
  );
}


function DreamCaptureShowcase() {
  return (
    <group position={[10.5, 0, -8.5]}>
      {/* New circular display platform */}
      <mesh
        position={[0, -1.25, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[3.6, 64]} />
        <meshStandardMaterial
          color="#b7a1d7"
          roughness={0.8}
        />
      </mesh>

      {/* Glowing circular rim */}
      <mesh
        position={[0, -1.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[3.35, 3.48, 64]} />
        <meshStandardMaterial
          color="#ffe3a6"
          emissive="#ffc96f"
          emissiveIntensity={1.4}
        />
      </mesh>

      {/* Camera body */}
      <Float speed={0.8} floatIntensity={0.12}>
        <group position={[0, 0.25, 0]}>
          <mesh>
            <boxGeometry args={[1.5, 0.95, 0.65]} />
            <meshStandardMaterial
              color="#c7b2ed"
              roughness={0.35}
              metalness={0.15}
            />
          </mesh>

          {/* Camera top */}
          <mesh position={[0, 0.58, -0.02]}>
            <boxGeometry args={[0.55, 0.22, 0.48]} />
            <meshStandardMaterial color="#a18acb" />
          </mesh>

          {/* Lens facing the approaching camera */}
          <group position={[0, 0, 0.38]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.34, 0.4, 0.32, 40]} />
              <meshStandardMaterial
                color="#8067ae"
                metalness={0.55}
                roughness={0.25}
              />
            </mesh>

            <mesh position={[0, 0, 0.17]}>
              <sphereGeometry args={[0.23, 32, 24]} />
              <meshStandardMaterial
                color="#8ce4ff"
                emissive="#55baff"
                emissiveIntensity={0.7}
                metalness={0.45}
                roughness={0.15}
              />
            </mesh>
          </group>

          {/* Shutter button */}
          <mesh position={[0.48, 0.59, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.1, 24]} />
            <meshStandardMaterial
              color="#ffe4a6"
              emissive="#ffc96f"
              emissiveIntensity={0.7}
            />
          </mesh>
        </group>
      </Float>

      {/* Portfolio title */}
      <Text
        position={[0, -0.9, 0.2]}
        fontSize={0.27}
        color="#fff4ff"
        anchorX="center"
        anchorY="middle"
      >
        DREAMCAPTURE
      </Text>

      <Text
        position={[0, -1.3, 0.2]}
        fontSize={0.14}
        color="#fff0bd"
        anchorX="center"
        anchorY="middle"
      >
        A NEW PERSPECTIVE
      </Text>

      <pointLight
        position={[0, 1.7, 0.5]}
        color="#d8c4ff"
        intensity={2}
        distance={8}
      />

      <Sparkles
        count={65}
        position={[0, 0.5, 0]}
        scale={[5, 3, 4]}
        size={1.8}
        speed={0.25}
        color="#ffe8b8"
      />
    </group>
  );
}


function DreamWorkshopGate() {
  return (
    <Suspense fallback={null}>
      <DreamWorkshopModels />
    </Suspense>
  );
}
function WorkshopLoadingPlaceholder() {
  return (
    <group position={[8.5, 0, -5.2]}>
      {/* Temporary floor */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[8, 0.2, 6]} />
        <meshStandardMaterial color="#b8a4dc" />
      </mesh>

      {/* Temporary moon */}
      <mesh position={[0, 2, -1.5]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial
          color="#fff0bc"
          emissive="#ffd878"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Loading indicator */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.35, 20, 20]} />
        <meshStandardMaterial
          color="#e9c9ff"
          emissive="#b77cff"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}
function World({ dreamNight }) {
  return (
    <>
      <color
  attach="background"
  args={[dreamNight ? "#b8c9f8" : "#10132f"]}
/>

      <fog
  attach="fog"
  args={[dreamNight ? "#b8c9f8" : "#10132f", 18, 55]}
/>

      <ambientLight
  intensity={dreamNight ? 0.65 : 0.18}
  color={dreamNight ? "#e8e1ff" : "#6475c8"}
/>

      <directionalLight
  position={[-5, 9, 5]}
  intensity={dreamNight ? 2.2 : 0.35}
  color={dreamNight ? "#fff0dc" : "#8794ff"}
/>

      <hemisphereLight
  skyColor={dreamNight ? "#b8d9ff" : "#25204f"}
  groundColor={dreamNight ? "#493957" : "#100d29"}
  intensity={dreamNight ? 1.1 : 0.35}
/>  

      <pointLight
        position={[0, 2.5, 1]}
        intensity={1.4}
        color="#b5eaff"
        distance={8}
      />

      <Sparkles
        count={70}
        scale={[14, 9, 10]}
        size={1.5}
        speed={0.2}
        color="#fff0ff"
      />

      <DreamClouds />

      <Suspense fallback={null}>
        <PipsNursery />
      </Suspense>

      <DreamWorkshopGate />
      <DreamCaptureShowcase />
      <TransitionMist />

      <FloatingIsland />

      <CameraJourney />
    </>
  );
}


function StoryContent() {
  return (
    <div className="story">
      {/* OPENING — INTRODUCTION */}
      
<section className="story-section opening" id="opening">
  <div className="story-copy opening-copy">
    <p className="eyebrow">
      <span className="eyebrow-star">✦</span>
      THE BEGINNING OF A DREAM
    </p>

    <h1>
      A lonely star.
      <br />
      <em>A little wish.</em>
    </h1>

    <p className="story-description">
      Once, a lonely star wished for someone who could
      understand its dreams. Beneath the moonlit sky,
      that wish came true. In a tiny cradle, Pip opened
      his eyes for the very first time.
    </p>

    <a className="discover-link" href="#island">
      <span className="discover-icon">↓</span>
      <span>Follow Pip's story</span>
    </a>
  </div>

  <div className="scene-caption">
    01 / THE FIRST WISH
  </div>
</section>


{/* SECTION 2 — PIP'S ARRIVAL */}
<section className="story-section arrival-section" id="arrival">
  <div className="story-copy arrival-copy">
    <p className="eyebrow">✦ A WISH BECOMES REAL</p>

    <h2>
      And then,
      <br />
      <em>there was Pip.</em>
    </h2>

    <p className="story-description">
      Beneath the moonlight, a lonely star's wish
      became something extraordinary. In a tiny
      cradle, a little dream engineer opened his eyes.
    </p>

    <p className="story-description">
      His name was Pip. And somewhere beyond the
      clouds, an entire world of dreams was waiting
      for him.
    </p>

    <a className="discover-link" href="#island">
      <span className="discover-icon">↓</span>
      <span>Follow the stars</span>
    </a>
  </div>

  <div className="scene-caption">
    02 / THE ARRIVAL OF PIP
  </div>
</section>


{/* SECTION 3 — THE FADING DREAMS */}
<section className="story-section fading-section" id="fading">
  <div className="story-copy fading-copy">
    <p className="eyebrow">✧ SOMETHING IS WRONG</p>

    <h2>
      The stars are
      <br />
      losing their
      <br />
      <em>imagination.</em>
    </h2>

    <p className="story-description">
      Far beyond the Midnight Nursery, the oldest star
      begins to forget the dreams it once held close.
      Its light grows dim, and across the sleeping sky,
      beautiful dreams start to disappear.
    </p>

    <p className="story-description">
      Pip has never faced anything like this before.
      To save the dreams, he will need someone brave
      enough to believe in them.
    </p>

    <a className="discover-link" href="#island">
      <span className="discover-icon">↓</span>
      <span>Follow the fading light</span>
    </a>
  </div>

  <div className="scene-caption">
    03 / THE FADING DREAMS
  </div>
</section>

      
<section className="story-section island-section" id="island">
  <div className="story-copy island-copy">
    <p className="eyebrow">✧ THE SILENCE BETWEEN STARS</p>

    <h2>
      Even stars
      <br />
      can forget
      <br />
      <em>to dream.</em>
    </h2>

    <p className="story-description">
      But something has changed in the dreaming sky.
      The oldest star, keeper of countless wishes,
      is slowly forgetting how to imagine. One by one,
      the dreams it once protected begin to fade.
    </p>

    <a className="discover-link" href="#world">
      <span className="discover-icon">↓</span>
      <span>Find out what happened</span>
    </a>
  </div>

  <div className="scene-caption">
    02 / WHEN DREAMS FADE
  </div>
</section>


      {/* WORLD — PIP'S NURSERY */}
      
<section className="story-section world-section" id="world">
  <div className="story-copy world-copy">
    <p className="eyebrow">✦ THE MIDNIGHT NURSERY</p>

    <h2>
      Oh, you're here.
      <br />
      <em>I'm Pip.</em>
    </h2>

    <p className="story-description">
      I'm the Junior Dream Engineer. I look after the
      little dreams that visit this nursery while the
      world sleeps.
    </p>

    <p className="story-description">
      But something is wrong. The oldest star has
      forgotten how to imagine, and the dreams across
      the sky are beginning to disappear.
    </p>

    <p className="story-description">
      Will you help me bring its imagination back?
    </p>

    <a className="discover-link" href="#workshop">
      <span className="discover-icon">↓</span>
      <span>Enter Pip's Dream Workshop</span>
    </a>
  </div>

  <div className="scene-caption">
    03 / A LITTLE DREAM ENGINEER
  </div>
</section>


<section className="story-section workshop-section" id="workshop">
  <div className="story-copy workshop-copy">
    <p className="eyebrow">✦ BEYOND THE NURSERY DOOR</p>

    <h2>
      Welcome to my
      <br />
      <em>Dream Workshop.</em>
    </h2>

    <p className="story-description">
      Every dream begins with a little imagination.
      Help me bring the oldest star's dreams back to life.
    </p>

    <p className="eyebrow">01 / LULLABY LAB</p>

    <h3>A melody for sleepy dreams.</h3>

    <p className="story-description">
      This magical music box fills the quiet sky with
      gentle melodies, carrying little dreams through
      the night. Every note brings a little wonder back
      to the stars.
    </p>

    <a className="discover-link" href="#nightlight">
      <span className="discover-icon">↓</span>
      <span>Discover the next dream</span>
    </a>
  </div>

  <div className="scene-caption">
    04 / LULLABY LAB
  </div>
</section>





{/* DREAMCAPTURE — FOURTH SHOWCASE */}
<section
  className="story-section world-section capture-section"
  id="dreamcapture"
>
  <div className="story-copy world-copy">
    <p className="eyebrow">
      <span className="eyebrow-star">✦</span>
      THE NEXT DREAM
    </p>

    <h2>
      Capture
      <br />
      <em>the wonder.</em>
    </h2>

    <p className="story-description">
      Every perspective tells a story.
      DREAMCAPTURE is a concept for an intelligent
      visual explorer that turns captured moments
      into meaningful discoveries.
    </p>

    <p className="story-description">
      Explore the concept, discover its possibilities,
      and imagine a new way to experience the world.
    </p>
  </div>

  <p className="scene-caption">
    A NEW PERSPECTIVE AWAITS
  </p>
</section>

{/* PROJECT 3 — DREAM DELIVERY ROUTES */}
<section
  className="story-section routes-section"
  id="dream-routes"
>
  <div className="story-copy routes-copy">
    <p className="eyebrow">✦ A JOURNEY THROUGH THE NIGHT</p>

    <h2>
      Every dream
      <br />
      finds its way
      <br />
      <em>home.</em>
    </h2>

    <p className="story-description">
      I map secret paths across the sleeping sky,
      delivering little dreams to the creatures who
      need them most.
    </p>

    <p className="story-description">
      Choose a destination and help me deliver
      a dream before the last star goes dark.
    </p>

    <div className="dream-destinations">
      <button
        type="button"
        onClick={() =>
          document.getElementById("delivery-message").textContent =
            "🌙 A peaceful moon dream is on its way!"
        }
      >
        🌙 Moon Cottage
      </button>

      <button
        type="button"
        onClick={() =>
          document.getElementById("delivery-message").textContent =
            "⭐ A sparkling star dream is on its way!"
        }
      >
        ⭐ Star House
      </button>

      <p id="delivery-message" aria-live="polite">
        Choose where to deliver a dream.
      </p>
    </div>

    <a className="discover-link" href="#ending">
      <span className="discover-icon">↓</span>
      <span>Continue Pip's story</span>
    </a>
  </div>

  <div className="scene-caption">
    06 / DREAM DELIVERY ROUTES
  </div>
</section>



<section className="story-section ending-section" id="ending">
  <div className="story-copy ending-copy">
    <p className="eyebrow">✦ THE LAST STAR AWAKENS</p>

    <h2>
      You brought
      <br />
      <em>the wonder back.</em>
    </h2>

    <p className="story-description">
      With your help, the oldest star remembers how
      to imagine. Its light spreads across the sky,
      bringing every fading dream back to life.
    </p>

    <p className="story-description">
      The Midnight Nursery glows once more. Pip looks
      up at the stars, then turns to you with a quiet
      smile.
    </p>

    <h3>
      "I was someone's dream, too."
    </h3>

    <p className="story-description">
      And perhaps, just perhaps, every dream begins
      with someone who believes it is worth imagining.
    </p>

    <a className="discover-link" href="#opening">
      <span className="discover-icon">↗</span>
      <span>Dream with Pip again</span>
    </a>
  </div>

  <div className="scene-caption">
    05 / SOMEONE'S DREAM, TOO
  </div>
</section>

      {/* SCROLL PROGRESS */}
      <div className="scroll-progress" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}


export default function App() {
  useEffect(() => {
  window.history.scrollRestoration = "manual";

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant",
  });
}, []);
const [dreamNight, setDreamNight] = useState(true);
const [pipSecret, setPipSecret] = useState(false);
const [soundOn, setSoundOn] = useState(false);
  return (

    
  <div className="dream-experience">
    <div className="scene-canvas">
      <div className="scroll-hint">
  <span className="scroll-hint-icon">↓</span>
  <span>Scroll slowly to experience the story</span>
</div>
      <Canvas
        camera={{ position: [0, 0.6, 10], fov: 45 }}
        dpr={1}
        gl={{ antialias: false, alpha: false }}
      >
        <World dreamNight={dreamNight} />
      </Canvas>
    </div>

    <button
      type="button"
      className="mood-toggle"
      onClick={() => setDreamNight((prev) => !prev)}
    >
      {dreamNight ? "☀️ Wake the Nursery" : "🌙 Enter Dream Mode"}
    </button>

    <button
  type="button"
  className="secret-toggle"
  onClick={() => setPipSecret((prev) => !prev)}
>
  {pipSecret ? "Close Secret" : "✦ Find Pip's Secret"}
</button>

    <audio
  id="dream-lullaby"
  src="/assets/lullaby.mp3"
  loop
/>

<button
  type="button"
  className="sound-toggle"
  onClick={async () => {
    const audio = document.getElementById("dream-lullaby");

    if (!audio) return;

    if (soundOn) {
      audio.pause();
      setSoundOn(false);
    } else {
      try {
        await audio.play();
        setSoundOn(true);
      } catch (error) {
        console.error("Audio playback failed:", error);
      }
    }
  }}
>
  {soundOn ? "🔊 Mute Lullaby" : "🔇 Play Lullaby"}
</button>

    {pipSecret && (
  <div className="pip-secret">
    ✨ Psst... even the stars need
    someone to believe in them.
  </div>
)}
    <div className="scene-vignette" />
    <StoryContent />
  </div>
);
}
