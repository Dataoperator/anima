import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface QuantumParticlesProps {
  count: number;
  quantumState: {
    entanglement: number;
    coherence: number;
    superposition: number;
  };
}

export const QuantumParticles: React.FC<QuantumParticlesProps> = ({ count, quantumState }) => {
  const points = useRef<THREE.Points>();
  const particlesGeometry = useRef<THREE.BufferGeometry>();

  // Generate initial particle positions
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.sin(theta) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    return pos;
  }, [count]);

  // Generate colors based on quantum state
  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      color.setHSL(
        0.6 + quantumState.coherence * 0.2,
        0.5 + quantumState.entanglement * 0.5,
        0.5 + quantumState.superposition * 0.5
      );
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return cols;
  }, [count, quantumState]);

  useFrame((state, delta) => {
    if (!points.current || !particlesGeometry.current) return;

    const positions = particlesGeometry.current.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    // Update particle positions based on quantum state
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Quantum wave function simulation
      positions[i3] = x + Math.sin(time * quantumState.coherence + y) * 0.01;
      positions[i3 + 1] = y + Math.cos(time * quantumState.entanglement + x) * 0.01;
      positions[i3 + 2] = z + Math.sin(time * quantumState.superposition) * 0.01;
    }

    particlesGeometry.current.attributes.position.needsUpdate = true;
    points.current.rotation.y += delta * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry ref={particlesGeometry}>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        vertexColors
        blending={THREE.AdditiveBlending}
        transparent
        opacity={0.6}
      />
    </points>
  );
};
