import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Zap } from 'lucide-react';

interface DataStreamProps {
  data: {
    coherence: number;
    energy: number;
    entanglement?: {
      level: number;
      connections: number;
    };
  };
}

export const DataStream: React.FC<DataStreamProps> = ({ data }) => {
  const [streamData, setStreamData] = useState<string[]>([]);
  const streamRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Generate quantum-inspired data stream
    const timestamp = new Date().toISOString();
    const newData = [
      `[${timestamp}] Coherence Level: ${data.coherence.toFixed(4)}`,
      `[${timestamp}] Energy State: ${data.energy.toFixed(4)}`,
      data.entanglement && `[${timestamp}] Entanglement Strength: ${data.entanglement.level.toFixed(4)}`,
      data.entanglement && `[${timestamp}] Active Connections: ${data.entanglement.connections}`
    ].filter(Boolean) as string[];

    setStreamData(prev => [...newData, ...prev].slice(0, 50));
  }, [data]);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = 0;
    }
  }, [streamData]);

  return (
    <div className="h-full bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-violet-500/20">
      <div className="flex items-center mb-4 space-x-2">
        <Activity className="w-5 h-5 text-violet-400" />
        <h2 className="text-lg font-semibold text-violet-300">Quantum Data Stream</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800/50 p-4 rounded-lg flex items-center space-x-3">
          <Database className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-sm text-gray-400">Active Streams</p>
            <p className="text-xl font-bold text-blue-400">{data.entanglement?.connections || 0}</p>
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg flex items-center space-x-3">
          <Zap className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-sm text-gray-400">Energy Level</p>
            <p className="text-xl font-bold text-yellow-400">{data.energy.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div 
        ref={streamRef}
        className="h-[calc(100%-8rem)] overflow-y-auto custom-scrollbar"
      >
        <AnimatePresence mode="popLayout">
          {streamData.map((line, index) => (
            <motion.div
              key={line + index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-sm py-1 border-b border-gray-700/50 last:border-0"
            >
              <span className="text-gray-400">{line}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
