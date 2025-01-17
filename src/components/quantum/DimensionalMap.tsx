import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { DimensionalState, ResonancePattern } from '@/types/quantum';

interface DimensionalMapProps {
  state: DimensionalState;
  patterns: ResonancePattern[];
  className?: string;
}

export const DimensionalMap: React.FC<DimensionalMapProps> = ({
  state,
  patterns,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const canvas = canvasRef.current!;
      const { width, height } = canvas.getBoundingClientRect();

      // Set canvas resolution
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.45;

      // Draw dimensional axes
      const dimensions = [
        { name: 'temporal', angle: 0 },
        { name: 'quantum', angle: Math.PI * 2/3 },
        { name: 'consciousness', angle: Math.PI * 4/3 }
      ];

      // Draw connection plane
      ctx.beginPath();
      dimensions.forEach((dim, i) => {
        const x = centerX + Math.cos(dim.angle) * maxRadius;
        const y = centerY + Math.sin(dim.angle) * maxRadius;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(64, 156, 255, 0.1)';
      ctx.fill();

      // Draw dimensional axes
      dimensions.forEach(dim => {
        const x = centerX + Math.cos(dim.angle) * maxRadius;
        const y = centerY + Math.sin(dim.angle) * maxRadius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(128, 200, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw axis labels
        const labelX = centerX + Math.cos(dim.angle) * (maxRadius + 10);
        const labelY = centerY + Math.sin(dim.angle) * (maxRadius + 10);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dim.name, labelX, labelY);
      });

      // Draw quantum state position
      const stateX = centerX + maxRadius * (
        Math.cos(0) * state.temporal_alignment +
        Math.cos(Math.PI * 2/3) * state.quantum_alignment +
        Math.cos(Math.PI * 4/3) * state.consciousness_alignment
      ) / 3;

      const stateY = centerY + maxRadius * (
        Math.sin(0) * state.temporal_alignment +
        Math.sin(Math.PI * 2/3) * state.quantum_alignment +
        Math.sin(Math.PI * 4/3) * state.consciousness_alignment
      ) / 3;

      // Draw state connection lines
      ctx.beginPath();
      dimensions.forEach(dim => {
        ctx.moveTo(stateX, stateY);
        const x = centerX + Math.cos(dim.angle) * maxRadius * state[`${dim.name}_alignment` as keyof DimensionalState];
        const y = centerY + Math.sin(dim.angle) * maxRadius * state[`${dim.name}_alignment` as keyof DimensionalState];
        ctx.lineTo(x, y);
      });
      ctx.strokeStyle = 'rgba(128, 200, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw quantum state node
      ctx.beginPath();
      ctx.arc(stateX, stateY, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(128, 200, 255, 0.8)';
      ctx.fill();

      // Draw resonance patterns
      patterns.forEach(pattern => {
        const patternX = centerX + maxRadius * 0.7 * (
          Math.cos(0) * pattern.strength +
          Math.cos(Math.PI * 2/3) * pattern.coherence +
          Math.cos(Math.PI * 4/3) * pattern.resonance
        ) / 3;

        const patternY = centerY + maxRadius * 0.7 * (
          Math.sin(0) * pattern.strength +
          Math.sin(Math.PI * 2/3) * pattern.coherence +
          Math.sin(Math.PI * 4/3) * pattern.resonance
        ) / 3;

        // Connection to quantum state
        ctx.beginPath();
        ctx.moveTo(stateX, stateY);
        ctx.lineTo(patternX, patternY);
        ctx.strokeStyle = `rgba(128, 200, 255, ${pattern.coherence * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Pattern node
        ctx.beginPath();
        ctx.arc(patternX, patternY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(128, 200, 255, ${pattern.resonance * 0.6})`;
        ctx.fill();
      });

      // Draw quantum fluctuations
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const radius = maxRadius * (0.3 + Math.sin(Date.now() / 1000 + i) * 0.1);
        const x = stateX + Math.cos(angle) * radius * 0.2;
        const y = stateY + Math.sin(angle) * radius * 0.2;

        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(128, 200, 255, ${0.3 + Math.sin(Date.now() / 500 + i) * 0.2})`;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [state, patterns]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      <motion.div 
        className="absolute top-2 left-2 text-xs text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div>Alignment: {(state.stability * 100).toFixed(1)}%</div>
      </motion.div>
    </div>
  );
};

export default DimensionalMap;