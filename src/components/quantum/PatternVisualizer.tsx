import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResonancePattern, PatternMetrics } from '@/types/quantum';

interface PatternVisualizerProps {
  patterns: ResonancePattern[];
  metrics: PatternMetrics;
  scale?: number;
  className?: string;
}

export const PatternVisualizer: React.FC<PatternVisualizerProps> = ({
  patterns,
  metrics,
  scale = 1,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const canvas = canvasRef.current!;
      const { width, height } = canvas.getBoundingClientRect();

      // Set canvas resolution
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw patterns
      patterns.forEach((pattern, index) => {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.4 * scale;

        // Calculate pattern position
        const angle = (index / patterns.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius * pattern.strength;
        const y = centerY + Math.sin(angle) * radius * pattern.strength;

        // Draw connection lines
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(64, 156, 255, ${pattern.coherence * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw pattern node
        ctx.beginPath();
        ctx.arc(x, y, pattern.strength * 10, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(64, 156, 255, ${pattern.resonance})`;
        ctx.fill();

        // Draw resonance ring
        ctx.beginPath();
        ctx.arc(x, y, pattern.strength * 15, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(128, 200, 255, ${pattern.coherence * 0.3})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw central node
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(128, 200, 255, ${metrics.coherence})`;
      ctx.fill();

      // Draw stability ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12 * scale, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(64, 156, 255, ${metrics.stability})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    draw();

    // Animate patterns
    let animationFrame: number;
    const animate = () => {
      draw();
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, [patterns, metrics, scale]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Pattern Info Overlay */}
      <motion.div 
        className="absolute top-2 left-2 text-xs text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div>Patterns: {patterns.length}</div>
        <div>Sync: {(metrics.synchronization * 100).toFixed(1)}%</div>
      </motion.div>
    </div>
  );
};

export default PatternVisualizer;