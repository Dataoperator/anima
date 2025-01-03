import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { QuantumState } from '@/types/quantum';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Point, PointMaterial, Points } from '@react-three/drei';

interface QuantumStateVisualizerProps {
  state: QuantumState;
  className?: string;
  showParticles?: boolean;
  interactive?: boolean;
}

const QuantumParticles: React.FC<{ count: number; coherence: number }> = ({ count, coherence }) => {
  const points = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!points.current) return;

    const time = state.clock.getElapsedTime();
    const positions = points.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      const i3 = i / 3;
      positions[i] = Math.sin(time + i3) * coherence * 3;
      positions[i + 1] = Math.cos(time + i3) * coherence * 3;
      positions[i + 2] = Math.sin(time * 2 + i3) * coherence * 3;
    }

    points.current.geometry.attributes.position.needsUpdate = true;
  });

  const particleCount = Math.floor(count * coherence);
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    const r = Math.random() * 3;

    positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(theta);
  }

  return (
    <Points ref={points} limit={1000}>
      <pointsMaterial
        size={0.05}
        transparent
        opacity={0.6}
        color="#8b5cf6"
        blending={THREE.AdditiveBlending}
      />
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
    </Points>
  );
};

const QuantumCore: React.FC<{
  coherence: number;
  energy: number;
  stability: number;
}> = ({ coherence, energy, stability }) => {
  const sphere = useRef<THREE.Mesh>(null);
  const controls = useAnimation();

  useFrame((state) => {
    if (!sphere.current) return;

    const time = state.clock.getElapsedTime();
    sphere.current.scale.x = 1 + Math.sin(time * 2) * 0.1 * coherence;
    sphere.current.scale.y = 1 + Math.cos(time * 2) * 0.1 * coherence;
    sphere.current.scale.z = 1 + Math.sin(time * 3) * 0.1 * coherence;

    // Rotate based on energy
    sphere.current.rotation.x += 0.01 * energy;
    sphere.current.rotation.y += 0.01 * energy;

    // Apply stability influence
    const wobble = (1 - stability) * 0.1;
    sphere.current.position.x = Math.sin(time * 4) * wobble;
    sphere.current.position.y = Math.cos(time * 4) * wobble;
  });

  return (
    <Sphere ref={sphere} args={[1, 32, 32]}>
      <meshPhysicalMaterial
        color="#8b5cf6"
        roughness={0.2}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.2}
        transmission={0.5}
        thickness={0.5}
        opacity={0.8}
        transparent
      />
    </Sphere>
  );
};

const QuantumField: React.FC<{
  stability: number;
  energy: number;
}> = ({ stability, energy }) => {
  const field = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!field.current) return;

    const time = state.clock.getElapsedTime();
    field.current.rotation.y = time * 0.1 * energy;

    // Create energy field distortions
    field.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const distortion = (1 - stability) * 0.2;
      mesh.position.y = Math.sin(time + i) * distortion;
      mesh.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1);
    });
  });

  return (
    <group ref={field}>
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[0, 0, 0]}
          rotation={[0, (Math.PI * 2 * i) / 8, 0]}
        >
          <torusGeometry args={[2, 0.02, 16, 100]} />
          <meshPhysicalMaterial
            color="#8b5cf6"
            roughness={0.3}
            metalness={0.7}
            opacity={0.2}
            transparent
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

export const QuantumStateVisualizer: React.FC<QuantumStateVisualizerProps> = ({
  state,
  className,
  showParticles = true,
  interactive = true,
}) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <QuantumField
          stability={state.stability}
          energy={state.energy}
        />

        <QuantumCore
          coherence={state.coherence}
          energy={state.energy}
          stability={state.stability}
        />

        {showParticles && (
          <QuantumParticles
            count={1000}
            coherence={state.coherence}
          />
        )}
      </Canvas>

      {interactive && (
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 p-2 bg-black/40 backdrop-blur-sm rounded-lg">
          <div className="space-y-1">
            <div className="text-xs text-violet-400/60">Coherence</div>
            <div className="h-1 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-violet-500/40"
                animate={{ width: `${state.coherence * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-violet-400/60">Energy</div>
            <div className="h-1 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-violet-500/40"
                animate={{ width: `${state.energy * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-violet-400/60">Stability</div>
            <div className="h-1 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-violet-500/40"
                animate={{ width: `${state.stability * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
