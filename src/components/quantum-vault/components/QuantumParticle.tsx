import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { QuantumParticleProps } from '../types';

export const QuantumParticle: React.FC<QuantumParticleProps> = ({ position, color }) => {
  const meshRef = useRef<THREE.Mesh>();
  const rotationSpeed = useRef({ x: 0.01, y: 0.01 });

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Dynamic rotation based on sine wave for more quantum-like behavior
      const time = state.clock.getElapsedTime();
      rotationSpeed.current = {
        x: Math.sin(time) * 0.02,
        y: Math.cos(time) * 0.02
      };

      meshRef.current.rotation.x += rotationSpeed.current.x;
      meshRef.current.rotation.y += rotationSpeed.current.y;

      // Subtle scale pulsing
      const scale = 1 + Math.sin(time * 2) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.5, 32, 32]}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.2}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.2}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
};

export default QuantumParticle;