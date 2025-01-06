import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useGLTF } from '@react-three/drei';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';

interface QuantumStateVisualizerProps {
  resonance: number;
  harmony: number;
  className?: string;
}

interface ParticleProps {
  position: [number, number, number];
  color: string;
  pulseSpeed?: number;
  rotationSpeed?: number;
}

interface WaveDataPoint {
  time: number;
  resonance: number;
  harmony: number;
}

const generateWaveData = (
  resonance: number,
  harmony: number,
  points: number = 50
): WaveDataPoint[] => {
  return Array.from({ length: points }, (_, i) => {
    const time = i;
    const t = i * 0.1;
    return {
      time,
      resonance: Math.sin(t) * Math.cos(t * resonance * 0.5) * resonance,
      harmony: Math.cos(t) * Math.sin(t * harmony * 0.5) * harmony
    };
  });
};

const QuantumParticle: React.FC<ParticleProps> = ({ 
  position, 
  color, 
  pulseSpeed = 1,
  rotationSpeed = 1
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.x += 0.01 * rotationSpeed;
    meshRef.current.rotation.y += 0.01 * rotationSpeed;
    
    const newScale = 1 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.1;
    setScale(newScale);
    
    meshRef.current.scale.set(newScale, newScale, newScale);
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.5, 32, 32]}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.3}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </Sphere>
  );
};

const QuantumField: React.FC<{ resonance: number; harmony: number }> = ({ 
  resonance, 
  harmony 
}) => {
  const particles = useMemo(() => {
    const count = 5;
    const radius = 2;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 2;
      
      return {
        position: [x, y, z] as [number, number, number],
        color: `hsl(${(i / count) * 360}, ${70 + resonance * 30}%, ${50 + harmony * 20}%)`,
        pulseSpeed: 0.5 + Math.random() * 1.5,
        rotationSpeed: 0.5 + Math.random() * 1.5
      };
    });
  }, [resonance, harmony]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI - Math.PI / 4}
      />
      {particles.map((particle, index) => (
        <QuantumParticle
          key={index}
          position={particle.position}
          color={particle.color}
          pulseSpeed={particle.pulseSpeed}
          rotationSpeed={particle.rotationSpeed}
        />
      ))}
    </>
  );
};

export const QuantumStateVisualizer: React.FC<QuantumStateVisualizerProps> = ({
  resonance,
  harmony,
  className = ''
}) => {
  const [waveData, setWaveData] = useState<WaveDataPoint[]>([]);
  const controls = useAnimation();

  useEffect(() => {
    const data = generateWaveData(resonance, harmony);
    setWaveData(data);

    controls.start({
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, [resonance, harmony]);

  const formatTooltip = useCallback((value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  }, []);

  return (
    <ErrorBoundary>
      <div className={`relative ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]"
        >
          <div className="relative bg-black/20 rounded-lg overflow-hidden">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
              <QuantumField resonance={resonance} harmony={harmony} />
            </Canvas>
          </div>

          <div className="bg-black/20 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waveData}>
                <XAxis 
                  dataKey="time" 
                  stroke="#ffffff40"
                  strokeDasharray="3 3"
                />
                <YAxis 
                  stroke="#ffffff40"
                  tickFormatter={formatTooltip}
                  strokeDasharray="3 3"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    padding: '8px'
                  }}
                  formatter={formatTooltip}
                />
                <Line
                  type="monotone"
                  dataKey="resonance"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="harmony"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          animate={controls}
          className="mt-4 grid grid-cols-2 gap-4"
        >
          <div className="bg-black/20 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-violet-300 font-medium mb-2">Resonance</h3>
            <div className="text-2xl font-bold text-white">
              {(resonance * 100).toFixed(2)}%
            </div>
          </div>
          <div className="bg-black/20 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-indigo-300 font-medium mb-2">Harmony</h3>
            <div className="text-2xl font-bold text-white">
              {(harmony * 100).toFixed(2)}%
            </div>
          </div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};