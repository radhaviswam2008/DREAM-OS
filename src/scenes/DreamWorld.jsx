
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";

function StarCore() {
  const group = useRef();
  const core = useRef();
  const halo = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;

    group.current.rotation.y += delta * 0.12;
    group.current.rotation.z += delta * 0.06;

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.055;
    if (core.current) core.current.scale.setScalar(pulse);
    if (halo.current) {
      halo.current.material.opacity =
        0.16 + (Math.sin(state.clock.elapsedTime * 1.6) + 1) * 0.06;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.42, 2]} />
        <meshStandardMaterial
          color="#fff2c6"
          emissive="#ffbf64"
          emissiveIntensity={3.5}
          roughness={0.25}
          metalness={0.05}
        />
      </mesh>

      <mesh ref={halo}>
        <sphereGeometry args={[0.72, 32, 32]} />
        <meshBasicMaterial
          color="#ffca7a"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh rotation={[0.3, 0.2, 0]}>
        <torusGeometry args={[1.1, 0.012, 8, 120]} />
        <meshBasicMaterial color="#e9c8ff" transparent opacity={0.75} />
      </mesh>

      <mesh rotation={[1.1, 0.6, 0.3]}>
        <torusGeometry args={[1.42, 0.009, 8, 120]} />
        <meshBasicMaterial color="#ffdca1" transparent opacity={0.55} />
      </mesh>

      <pointLight color="#ffce86" intensity={12} distance={12} decay={2} />
    </group>
  );
}

function ParticleOrbit() {
  const points = useRef();

  const positions = useMemo(() => {
    const values = new Float32Array(900 * 3);

    for (let i = 0; i < 900; i++) {
      const radius = 1.3 + Math.random() * 4.5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 5;

      values[i * 3] = Math.cos(angle) * radius;
      values[i * 3 + 1] = height;
      values[i * 3 + 2] = Math.sin(angle) * radius;
    }

    return values;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;

    points.current.rotation.y += delta * 0.018;
    points.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.08) * 0.035;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f6d7b0"
        size={0.025}
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function WorldScene() {
  const cameraRig = useRef();

  useFrame((state) => {
    if (!cameraRig.current) return;

    const t = state.clock.elapsedTime;
    cameraRig.current.position.x = Math.sin(t * 0.11) * 0.12;
    cameraRig.current.position.y = Math.cos(t * 0.13) * 0.08;
  });

  return (
    <>
      <color attach="background" args={["#100c24"]} />
      <fog attach="fog" args={["#100c24", 9, 27]} />

      <ambientLight intensity={0.55} color="#c4b3ff" />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.2}
        color="#ffe5c4"
      />

      <group ref={cameraRig}>
        <StarCore />
      </group>

      <ParticleOrbit />

      <Stars
        radius={70}
        depth={35}
        count={1800}
        factor={2.5}
        saturation={0}
        fade
        speed={0.25}
      />

      <Float speed={0.7} rotationIntensity={0.08} floatIntensity={0.15}>
        <group position={[-3.2, 1.7, -2.5]}>
          <mesh>
            <sphereGeometry args={[0.14, 20, 20]} />
            <meshBasicMaterial color="#e5c9ff" />
          </mesh>
          <pointLight color="#bda4ff" intensity={1.4} distance={3} />
        </group>
      </Float>

      <Float speed={0.45} rotationIntensity={0.12} floatIntensity={0.2}>
        <group position={[3.5, -1.6, -3]}>
          <mesh>
            <octahedronGeometry args={[0.16, 0]} />
            <meshBasicMaterial color="#ffdca0" />
          </mesh>
        </group>
      </Float>

      <Sparkles
        count={100}
        scale={[10, 7, 9]}
        size={2}
        speed={0.18}
        opacity={0.7}
        color="#f4d6ff"
      />
    </>
  );
}

export default function DreamWorld() {
  return (
    <div className="dream-world">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.25;
        }}
      >
        <WorldScene />
      </Canvas>
    </div>
  );
}
