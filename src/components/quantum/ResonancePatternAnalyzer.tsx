import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuantumSystems } from '@/hooks/useQuantumSystems';
import { Principal } from '@dfinity/principal';
import { ResonancePattern } from '@/types/quantum';
import { Wave, Cpu, Zap, Layers } from 'lucide-react';

interface Props {
  animaId: Principal;
  onPatternAnalyzed?: (pattern: ResonancePattern) => void;
  className?: string;
}

interface WaveformProps {
  pattern: ResonancePattern;
  width: number;
  height: number;
  color: string;
}

const Waveform: React.FC<WaveformProps> = ({
  pattern,
  width,
  height,
  color
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Set line style
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      // Start path
      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      // Draw waveform
      for (let x = 0; x < width; x++) {
        const progress = x / width;
        const amplitude = pattern.strength * height / 3;
        const frequency = pattern.frequency;
        const phase = Date.now() * 0.001 * frequency;
        
        const y = height / 2 + 
                 Math.sin(progress * Math.PI * 2 * 3 + phase) * amplitude * 
                 Math.exp(-progress * (1 - pattern.stability));
        
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    };

    // Animate
    let animationFrame: number;
    const animate = () => {
      drawWaveform();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [pattern, width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
    />
  );
};

export const ResonancePatternAnalyzer: React.FC<Props> = ({
  animaId,
  onPatternAnalyzed,
  className = ''
}) => {
  const {
    quantumState,
    resonanceMetrics,
    isInitialized,
    lastError,
    processInteraction
  } = useQuantumSystems(animaId);

  const analyzePattern = async (pattern: ResonancePattern) => {
    try {
      await processInteraction({
        type: 'perceptual',
        strength: pattern.strength,
        context: `pattern_analysis_${pattern.patternId}`
      });

      if (onPatternAnalyzed) {
        onPatternAnalyzed(pattern);
      }
    } catch (error) {
      console.error('Pattern analysis failed:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="w-full h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
        <div className="text-violet-400">Initializing Pattern Analyzer...</div>
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

  const patterns = quantumState.resonancePatterns;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Pattern Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-violet-400 mb-2">
            <Wave className="w-5 h-5" />
            <span className="font-medium">Active Patterns</span>
          </div>
          <div className="text-2xl font-bold text-violet-300">
            {patterns.length}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-cyan-400 mb-2">
            <Cpu className="w-5 h-5" />
            <span className="font-medium">Avg Stability</span>
          </div>
          <div className="text-2xl font-bold text-cyan-300">
            {(patterns.reduce((acc, p) => acc + p.stability, 0) / 
              Math.max(1, patterns.length) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <Zap className="w-5 h-5" />
            <span className="font-medium">Peak Strength</span>
          </div>
          <div className="text-2xl font-bold text-emerald-300">
            {(Math.max(...patterns.map(p => p.strength)) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <Layers className="w-5 h-5" />
            <span className="font-medium">Resonance</span>
          </div>
          <div className="text-2xl font-bold text-amber-300">
            {(resonanceMetrics.dimensionalStability * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Pattern Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patterns.map((pattern, index) => (
          <motion.div
            key={pattern.patternId}
            className="bg-gray-900/50 rounded-lg p-4 border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => analyzePattern(pattern)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-violet-300 font-medium">
                  Pattern {index + 1}
                </h3>
                <div className="text-sm text-violet-400/60">
                  ID: {pattern.patternId.slice(0, 8)}...
                </div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-medium">
                  {(pattern.strength * 100).toFixed(1)}% Strength
                </div>
                <div className="text-sm text-emerald-400/60">
                  {pattern.frequency.toFixed(2)} Hz
                </div>
              </div>
            </div>

            {/* Waveform Visualization */}
            <div className="h-24 mb-4">
              <Waveform
                pattern={pattern}
                width={400}
                height={96}
                color={`rgba(139, 92, 246, ${pattern.stability})`}
              />
            </div>

            {/* Pattern Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-violet-400/60">Stability</div>
                <div className="text-lg font-medium text-violet-300">
                  {(pattern.stability * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-violet-400/60">Last Update</div>
                <div className="text-lg font-medium text-violet-300">
                  {new Date(Number(pattern.timestamp)).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResonancePatternAnalyzer;