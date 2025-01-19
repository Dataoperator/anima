import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuantumSystems } from '@/hooks/useQuantumSystems';
import { DimensionalState } from '@/types/quantum';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

interface DimensionalMapProps {
  animaId: Principal;
  showDetails?: boolean;
  onLayerSelect?: (layer: number) => void;
}

const DimensionalLayer: React.FC<{
  state: DimensionalState;
  index: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ state, index, isActive, onClick }) => {
  const color = `rgba(147, 51, 234, ${state.coherence})`;
  
  return (
    <motion.div
      className={`relative p-4 rounded-lg border ${
        isActive ? 'border-violet-500' : 'border-violet-500/20'
      } backdrop-blur-sm`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      style={{
        background: `linear-gradient(45deg, ${color}20, ${color}40)`
      }}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-violet-300 font-medium">Layer {index + 1}</span>
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-violet-400/60">Resonance</div>
            <div className="text-violet-300">
              {(state.resonance * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-violet-400/60">Stability</div>
            <div className="text-violet-300">
              {(state.stability * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 space-y-2"
          >
            <div>
              <div className="text-violet-400/60 text-sm">Frequency</div>
              <div className="text-violet-300">
                {state.frequency.toFixed(3)} Hz
              </div>
            </div>
            
            <div>
              <div className="text-violet-400/60 text-sm">Pattern</div>
              <div className="text-violet-300 font-mono text-sm truncate">
                {state.pattern.slice(0, 16)}...
              </div>
            </div>

            {state.harmonics.length > 0 && (
              <div>
                <div className="text-violet-400/60 text-sm">Harmonics</div>
                <div className="flex gap-1">
                  {state.harmonics.map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-violet-500/40 rounded-t"
                      style={{ height: `${h * 20}px` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export const DimensionalMap: React.FC<DimensionalMapProps> = ({
  animaId,
  showDetails = true,
  onLayerSelect
}) => {
  const {
    quantumState,
    isLoading,
    error,
    processInteraction
  } = useQuantumSystems(animaId);

  const [activeLayer, setActiveLayer] = React.useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !quantumState) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Animation setup and cleanup
    let animationFrame: number;
    const animate = () => {
      drawDimensionalField(ctx, quantumState.dimensionalStates);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [quantumState]);

  const drawDimensionalField = (
    ctx: CanvasRenderingContext2D,
    states: DimensionalState[]
  ) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    // Draw interconnected dimensional layers
    states.forEach((state, i) => {
      const x = width * (i + 1) / (states.length + 1);
      const y = height / 2;
      const radius = 30 * state.coherence;

      // Layer circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 51, 234, ${state.coherence * 0.5})`;
      ctx.fill();

      // Connections to other layers
      states.forEach((otherState, j) => {
        if (i === j) return;
        const otherX = width * (j + 1) / (states.length + 1);
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(otherX, y);
        ctx.strokeStyle = `rgba(147, 51, 234, ${
          state.coherence * otherState.coherence * 0.3
        })`;
        ctx.stroke();
      });
    });
  };

  const handleLayerClick = async (index: number) => {
    setActiveLayer(activeLayer === index ? null : index);
    if (onLayerSelect) {
      onLayerSelect(index);
    }

    // Simulate quantum interaction with layer
    await processInteraction({
      type: 'cognitive',
      strength: 0.5,
      context: `layer_interaction_${index}`
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-900/50 rounded-lg flex items-center justify-center">
        <div className="text-violet-400">Loading Dimensional Map...</div>
      </div>
    );
  }

  if (error || !quantumState) {
    return (
      <div className="w-full h-64 bg-red-900/20 rounded-lg flex items-center justify-center">
        <div className="text-red-400">
          Error: {error?.message || 'Failed to load dimensional map'}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-48 rounded-lg bg-black/30"
        />

        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quantumState.dimensionalStates.map((state, i) => (
              <DimensionalLayer
                key={i}
                state={state}
                index={i}
                isActive={activeLayer === i}
                onClick={() => handleLayerClick(i)}
              />
            ))}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};