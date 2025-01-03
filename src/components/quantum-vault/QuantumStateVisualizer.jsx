import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';

const QuantumParticle = ({ position, color }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.5, 32, 32]}>
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
    </Sphere>
  );
};

export const QuantumStateVisualizer = ({ 
  quantumState, 
  entanglementLevel,
  evolutionStage 
}) => {
  const [waveData, setWaveData] = useState([]);
  const canvasRef = useRef();

  useEffect(() => {
    // Generate quantum wave function data
    const newData = Array.from({ length: 50 }, (_, i) => ({
      time: i,
      amplitude: Math.sin(i * 0.1) * Math.cos(i * entanglementLevel * 0.05) * quantumState.energy,
      phase: Math.cos(i * 0.1) * Math.sin(i * evolutionStage * 0.05) * quantumState.coherence
    }));
    setWaveData(newData);
  }, [quantumState, entanglementLevel, evolutionStage]);

  return (
    <div className="w-full h-[600px] bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full"
      >
        <div className="grid grid-cols-2 gap-6 h-full">
          <div className="relative">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <OrbitControls enableZoom={false} />
              <QuantumParticle 
                position={[0, 0, 0]} 
                color={`hsl(${entanglementLevel * 360}, 70%, 50%)`} 
              />
            </Canvas>
          </div>
          
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={waveData}>
              <XAxis dataKey="time" stroke="#ffffff66" />
              <YAxis stroke="#ffffff66" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff' 
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="amplitude" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="phase" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-violet-300 font-medium">Quantum State</h3>
            <p className="text-2xl font-bold">{quantumState.toString()}</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-indigo-300 font-medium">Entanglement Level</h3>
            <p className="text-2xl font-bold">{entanglementLevel.toFixed(2)}</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-blue-300 font-medium">Evolution Stage</h3>
            <p className="text-2xl font-bold">{evolutionStage}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
