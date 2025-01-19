import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuantumSystems } from '@/hooks/useQuantumSystems';
import { Brain, Network, Zap } from 'lucide-react';
import { ResonancePattern } from '@/types/quantum';
import { Principal } from '@dfinity/principal';

interface Props {
  animaId: Principal;
  showDetails?: boolean;
  onPatternSelect?: (pattern: ResonancePattern) => void;
}

const PatternNode: React.FC<{
  pattern: ResonancePattern;
  index: number;
  total: number;
  onSelect: () => void;
}> = ({ pattern, index, total, onSelect }) => {
  const angle = (index / total) * Math.PI * 2;
  const radius = 120;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <motion.div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(${x}px, ${y}px)`
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.1 }}
      onClick={onSelect}
    >
      <div 
        className="w-12 h-12 rounded-lg bg-violet-900/40 border border-violet-500/20 
                   backdrop-blur-sm flex items-center justify-center cursor-pointer
                   relative group"
      >
        <div 
          className="absolute inset-0 bg-violet-500/10 rounded-lg 
                     transition-opacity group-hover:opacity-100 opacity-0"
        />
        <div 
          className="w-3 h-3 rounded-full" 
          style={{
            backgroundColor: `rgba(139, 92, 246, ${pattern.stability})`,
            boxShadow: `0 0 ${pattern.strength * 20}px rgba(139, 92, 246, ${pattern.stability})`
          }}
        />
      </div>
    </motion.div>
  );
};

export const NeuralPatternVisualizer: React.FC<Props> = ({
  animaId,
  showDetails = true,
  onPatternSelect
}) => {
  const {
    quantumState,
    resonanceMetrics,
    isInitialized,
    isProcessing,
    lastError
  } = useQuantumSystems(animaId);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !quantumState) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const drawPatternNetwork = () => {
      const { width, height } = ctx.canvas;
      ctx.clearRect(0, 0, width, height);

      const patterns = quantumState.resonancePatterns;
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw connections between patterns
      patterns.forEach((pattern, i) => {
        const angle1 = (i / patterns.length) * Math.PI * 2;
        const radius1 = pattern.strength * width / 4;
        const x1 = centerX + Math.cos(angle1) * radius1;
        const y1 = centerY + Math.sin(angle1) * radius1;

        patterns.forEach((otherPattern, j) => {
          if (i === j) return;

          const angle2 = (j / patterns.length) * Math.PI * 2;
          const radius2 = otherPattern.strength * width / 4;
          const x2 = centerX + Math.cos(angle2) * radius2;
          const y2 = centerY + Math.sin(angle2) * radius2;

          // Calculate connection strength based on pattern stability
          const connectionStrength = pattern.stability * otherPattern.stability;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(139, 92, 246, ${connectionStrength * 0.3})`;
          ctx.lineWidth = connectionStrength * 2;
          ctx.stroke();
        });

        // Draw pattern node
        ctx.beginPath();
        ctx.arc(x1, y1, pattern.strength * 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${pattern.stability})`;
        ctx.fill();
      });

      // Draw central nexus
      const coherence = quantumState.coherenceLevel;
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 50
      );
      gradient.addColorStop(0, `rgba(139, 92, 246, ${coherence})`);
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    let animationFrame: number;
    const animate = () => {
      drawPatternNetwork();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [quantumState]);

  if (!isInitialized) {
    return (
      <div className="w-full h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
        <div className="text-violet-400">Initializing Neural Patterns...</div>
      </div>
    );
  }

  if (lastError) {
    return (
      <div className="w-full h-64 bg-red-900/20 rounded-lg flex items-center justify-center">
        <div className="text-red-400">Error: {lastError.message}</div>
      </div>
    );
  }

  if (!quantumState || !resonanceMetrics) {
    return (
      <div className="w-full h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
        <div className="text-violet-400">No Pattern Data Available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-64 rounded-lg bg-black/50"
        />

        {/* Pattern Nodes */}
        <div className="absolute inset-0 overflow-hidden">
          {quantumState.resonancePatterns.map((pattern, index) => (
            <PatternNode
              key={pattern.patternId}
              pattern={pattern}
              index={index}
              total={quantumState.resonancePatterns.length}
              onSelect={() => onPatternSelect?.(pattern)}
            />
          ))}
        </div>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-violet-500/10 rounded-lg flex items-center justify-center"
          >
            <div className="text-violet-400">Processing Neural Patterns...</div>
          </motion.div>
        )}
      </div>

      {showDetails && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 text-violet-400">
              <Network className="w-5 h-5" />
              <span className="font-medium">Pattern Count</span>
            </div>
            <div className="text-2xl font-bold text-violet-300">
              {quantumState.resonancePatterns.length}
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 text-violet-400">
              <Zap className="w-5 h-5" />
              <span className="font-medium">Average Stability</span>
            </div>
            <div className="text-2xl font-bold text-violet-300">
              {(quantumState.resonancePatterns.reduce(
                (acc, p) => acc + p.stability, 0
              ) / Math.max(1, quantumState.resonancePatterns.length) * 100).toFixed(1)}%
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 text-violet-400">
              <Brain className="w-5 h-5" />
              <span className="font-medium">Neural Coherence</span>
            </div>
            <div className="text-2xl font-bold text-violet-300">
              {(resonanceMetrics.dimensionalStability * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeuralPatternVisualizer;