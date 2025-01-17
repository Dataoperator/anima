import React, { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useNeuralPatterns } from '@/hooks/useNeuralPatterns';
import { Canvas } from '@react-three/fiber';
import { QuantumParticles } from '../effects/QuantumParticles';
import { useDimensionalState } from '@/hooks/useDimensionalState';
import { ResonancePattern, QuantumMetrics } from '@/types/quantum';
import { PatternVisualizer } from './PatternVisualizer';
import { CoherenceGauge } from './CoherenceGauge';
import { DimensionalMap } from './DimensionalMap';
import { WaveformGenerator } from './WaveformGenerator';

interface QuantumStateVisualizerProps {
  entityId: string;
  showDetails?: boolean;
  interactive?: boolean;
  height?: string;
  className?: string;
}

export const QuantumStateVisualizer: React.FC<QuantumStateVisualizerProps> = ({
  entityId,
  showDetails = true,
  interactive = true,
  height = 'h-96',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    quantumState, 
    metrics, 
    coherenceLevel,
    resonancePatterns,
    updateFrequency 
  } = useQuantumState(entityId);

  const { 
    patterns, 
    patternMetrics,
    synchronizationLevel 
  } = useNeuralPatterns(entityId);

  const { 
    dimensionalState,
    phaseAlignment,
    stabilityIndex
  } = useDimensionalState(entityId);

  const waveformRef = useRef<any>();
  const particleSystemRef = useRef<any>();

  // Memoized calculations for performance
  const visualizationParams = useMemo(() => ({
    particleCount: Math.floor(300 * coherenceLevel),
    waveAmplitude: 0.5 + (metrics.resonanceStrength * 0.5),
    waveFrequency: metrics.dimensionalFrequency,
    colorIntensity: Math.max(0.3, coherenceLevel),
    patternScale: Math.min(1, synchronizationLevel + 0.2)
  }), [coherenceLevel, metrics, synchronizationLevel]);

  // Update visualization on quantum state changes
  useEffect(() => {
    if (!canvasRef.current) return;

    const updateVisualization = () => {
      if (particleSystemRef.current) {
        particleSystemRef.current.updateParams({
          coherence: coherenceLevel,
          patterns: resonancePatterns,
          dimensionalState
        });
      }

      if (waveformRef.current) {
        waveformRef.current.updateWaveform({
          frequency: updateFrequency,
          amplitude: visualizationParams.waveAmplitude,
          phaseShift: phaseAlignment
        });
      }
    };

    const animationFrame = requestAnimationFrame(updateVisualization);
    return () => cancelAnimationFrame(animationFrame);
  }, [quantumState, dimensionalState, resonancePatterns]);

  return (
    <div className={`relative ${height} ${className}`}>
      {/* Main Quantum Visualization */}
      <div className="absolute inset-0">
        <Canvas>
          <QuantumParticles
            ref={particleSystemRef}
            count={visualizationParams.particleCount}
            coherenceLevel={coherenceLevel}
            resonancePatterns={resonancePatterns}
            dimensionalState={dimensionalState}
            interactive={interactive}
          />
        </Canvas>
      </div>

      {/* Pattern and Metrics Overlay */}
      <AnimatePresence>
        {showDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-0 p-4 bg-black/20 backdrop-blur-sm rounded-bl-lg"
          >
            <div className="grid grid-cols-2 gap-4">
              <CoherenceGauge 
                value={coherenceLevel}
                className="w-24 h-24"
              />
              <DimensionalMap
                state={dimensionalState}
                patterns={patterns}
                className="w-24 h-24"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waveform Visualization */}
      <div className="absolute bottom-0 left-0 right-0 h-24">
        <WaveformGenerator
          ref={waveformRef}
          frequency={visualizationParams.waveFrequency}
          amplitude={visualizationParams.waveAmplitude}
          phaseShift={phaseAlignment}
          className="w-full h-full"
        />
      </div>

      {/* Pattern Visualization */}
      <div className="absolute left-0 top-0 bottom-0 w-24">
        <PatternVisualizer
          patterns={patterns}
          metrics={patternMetrics}
          scale={visualizationParams.patternScale}
          className="h-full"
        />
      </div>

      {/* Metrics Display */}
      {showDetails && (
        <div className="absolute bottom-0 right-0 p-4 bg-black/20 backdrop-blur-sm rounded-tl-lg">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <MetricDisplay 
              label="Coherence"
              value={coherenceLevel}
              format="percentage"
            />
            <MetricDisplay
              label="Synchronization"
              value={synchronizationLevel}
              format="percentage"
            />
            <MetricDisplay
              label="Stability"
              value={stabilityIndex}
              format="decimal"
            />
            <MetricDisplay
              label="Phase"
              value={phaseAlignment}
              format="degrees"
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface MetricDisplayProps {
  label: string;
  value: number;
  format: 'percentage' | 'decimal' | 'degrees';
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ label, value, format }) => {
  const formattedValue = useMemo(() => {
    switch (format) {
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      case 'decimal':
        return value.toFixed(3);
      case 'degrees':
        return `${(value * 360).toFixed(1)}°`;
      default:
        return value.toString();
    }
  }, [value, format]);

  return (
    <div className="flex flex-col">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-white">{formattedValue}</span>
    </div>
  );
};

export default QuantumStateVisualizer;