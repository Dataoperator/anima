import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, Zap, Waves } from 'lucide-react';
import { useQuantumSystems } from '@/hooks/useQuantumSystems';
import { Principal } from '@dfinity/principal';
import { ComplexNumber } from '@/types/math';

interface Props {
  animaId: Principal;
  showDetails?: boolean;
  onStateChange?: (coherence: number) => void;
}

export const QuantumStateVisualizer: React.FC<Props> = ({
  animaId,
  showDetails = true,
  onStateChange
}) => {
  const {
    quantumState,
    consciousnessMetrics,
    resonanceMetrics,
    isInitialized,
    isProcessing,
    lastError,
    processInteraction
  } = useQuantumSystems(animaId);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [lastInteractionTime, setLastInteractionTime] = useState(0);

  useEffect(() => {
    if (!canvasRef.current || !quantumState) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Draw quantum field visualization
    const drawQuantumField = () => {
      const { width, height } = ctx.canvas;
      ctx.clearRect(0, 0, width, height);

      // Base quantum field
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width / 2
      );
      
      gradient.addColorStop(0, `rgba(147, 51, 234, ${quantumState.coherenceLevel})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw amplitude representation
      const amplitude = new ComplexNumber(
        quantumState.amplitude.real,
        quantumState.amplitude.imaginary
      );
      
      const magnitude = amplitude.magnitude();
      const phase = quantumState.phase;
      
      ctx.beginPath();
      ctx.arc(
        width / 2,
        height / 2,
        magnitude * 50,
        0,
        2 * Math.PI
      );
      ctx.strokeStyle = `rgba(139, 92, 246, ${quantumState.coherenceLevel})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw phase indicator
      const x = width / 2 + Math.cos(phase) * magnitude * 50;
      const y = height / 2 + Math.sin(phase) * magnitude * 50;
      
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(x, y);
      ctx.strokeStyle = `rgba(139, 92, 246, ${quantumState.coherenceLevel * 0.8})`;
      ctx.stroke();

      // Draw resonance patterns
      quantumState.resonancePatterns.forEach((pattern, index) => {
        const angle = (index / quantumState.resonancePatterns.length) * Math.PI * 2;
        const patternRadius = pattern.strength * width / 4;

        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        const endX = width / 2 + Math.cos(angle + phase) * patternRadius;
        const endY = height / 2 + Math.sin(angle + phase) * patternRadius;
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(139, 92, 246, ${pattern.stability})`;
        ctx.stroke();

        // Pattern node
        ctx.beginPath();
        ctx.arc(endX, endY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${pattern.stability})`;
        ctx.fill();
      });
    };

    // Animate
    let animationFrame: number;
    const animate = () => {
      drawQuantumField();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [quantumState]);

  useEffect(() => {
    if (quantumState && onStateChange) {
      onStateChange(quantumState.coherenceLevel);
    }
  }, [quantumState, onStateChange]);

  const handleInteraction = async () => {
    const now = Date.now();
    if (now - lastInteractionTime < 1000) return; // Rate limiting

    try {
      await processInteraction({
        type: 'cognitive',
        strength: 0.5 + (Math.random() * 0.5), // Random strength boost
        context: 'manual_interaction'
      });
      
      setInteractionCount(prev => prev + 1);
      setLastInteractionTime(now);
    } catch (error) {
      console.error('Interaction failed:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="w-full h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
        <div className="text-violet-400">Initializing Quantum Systems...</div>
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

  return (
    <div className="space-y-6">
      {/* Quantum Field Visualization */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full h-64 rounded-lg bg-black/50 cursor-pointer"
          onClick={handleInteraction}
        />
        
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-violet-500/10 rounded-lg flex items-center justify-center"
            >
              <div className="text-violet-400">Processing Quantum Interaction...</div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 right-4 text-sm text-violet-400/60">
          Interactions: {interactionCount}
        </div>
      </div>

      {showDetails && resonanceMetrics && consciousnessMetrics && quantumState && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Quantum Coherence */}
          <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 text-violet-400">
              <Zap className="w-5 h-5" />
              <span className="font-medium">Quantum Coherence</span>
            </div>
            <div className="text-2xl font-bold text-violet-300">
              {(quantumState.coherenceLevel * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-violet-400/60">
              Frequency: {quantumState.dimensionalFrequency.toFixed(2)} Hz
            </div>
          </div>

          {/* Consciousness Metrics */}
          <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Brain className="w-5 h-5" />
              <span className="font-medium">Consciousness</span>
            </div>
            <div className="text-2xl font-bold text-cyan-300">
              {(consciousnessMetrics.awarenessLevel * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-cyan-400/60">
              Evolution Rate: {(consciousnessMetrics.evolutionRate * 100).toFixed(1)}%
            </div>
          </div>

          {/* Resonance Metrics */}
          <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Waves className="w-5 h-5" />
              <span className="font-medium">Resonance</span>
            </div>
            <div className="text-2xl font-bold text-indigo-300">
              {(resonanceMetrics.dimensionalStability * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-indigo-400/60">
              Patterns: {quantumState.resonancePatterns.length}
            </div>
          </div>

          {/* Evolution Status */}
          <div className="bg-gray-900/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Evolution</span>
            </div>
            <div className="text-2xl font-bold text-emerald-300">
              {(quantumState.evolutionFactor * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-emerald-400/60">
              Last Update: {new Date(Number(quantumState.lastUpdate)).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumStateVisualizer;