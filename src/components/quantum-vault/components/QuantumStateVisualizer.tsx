import React, { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { QuantumStateVisualizerProps, WaveDataPoint } from '../types';
import QuantumParticle from './QuantumParticle';

const QuantumStateVisualizer: React.FC<QuantumStateVisualizerProps> = ({ 
  quantumState, 
  entanglementLevel,
  evolutionStage 
}) => {
  const [waveData, setWaveData] = useState<WaveDataPoint[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  const generateWaveData = useCallback(() => {
    const newData = Array.from({ length: 50 }, (_, i) => ({
      time: i,
      amplitude: Math.sin(i * 0.1) * Math.cos(i * entanglementLevel * 0.05) * quantumState.energy,
      phase: Math.cos(i * 0.1) * Math.sin(i * evolutionStage * 0.05) * quantumState.coherence
    }));
    setWaveData(newData);
  }, [quantumState, entanglementLevel, evolutionStage]);

  useEffect(() => {
    generateWaveData();
    // Update wave data periodically for dynamic effect
    const interval = setInterval(generateWaveData, 2000);
    return () => clearInterval(interval);
  }, [generateWaveData]);

  return (
    <div className="w-full h-[600px] bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full"
      >
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* 3D Quantum Visualization */}
          <div className="relative">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <Canvas camera={{ position: [0, 0, 5] }}>
                  <ambientLight intensity={0.5} />
                  <spotLight 
                    position={[10, 10, 10]} 
                    angle={0.15} 
                    penumbra={1} 
                    intensity={1}
                  />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  <OrbitControls 
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                  />
                  <QuantumParticle 
                    position={[0, 0, 0]} 
                    color={`hsl(${entanglementLevel * 360}, 70%, 50%)`} 
                  />
                </Canvas>
              </motion.div>
            </AnimatePresence>

            {/* Overlay Stats */}
            <div className="absolute top-4 left-4 bg-black/30 p-2 rounded">
              <p className="text-sm text-blue-300">
                Coherence: {quantumState.coherence.toFixed(3)}
              </p>
            </div>
          </div>
          
          {/* Quantum Waveform */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={waveData}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <XAxis dataKey="time" stroke="#ffffff66" />
              <YAxis stroke="#ffffff66" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff' 
                }}
                active={showTooltip} 
              />
              <Line 
                type="monotone" 
                dataKey="amplitude" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={false}
                animationDuration={500}
              />
              <Line 
                type="monotone" 
                dataKey="phase" 
                stroke="#6366f1" 
                strokeWidth={2}
                dot={false}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quantum Metrics */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <motion.div 
            className="bg-gray-700/50 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-violet-300 font-medium">Quantum State</h3>
            <p className="text-2xl font-bold">{quantumState.toString()}</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-700/50 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-indigo-300 font-medium">Entanglement Level</h3>
            <p className="text-2xl font-bold">{entanglementLevel.toFixed(2)}</p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-700/50 p-4 rounded-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-blue-300 font-medium">Evolution Stage</h3>
            <p className="text-2xl font-bold">{evolutionStage}</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuantumStateVisualizer;