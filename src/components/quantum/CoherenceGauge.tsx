import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CoherenceGaugeProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export const CoherenceGauge: React.FC<CoherenceGaugeProps> = ({
  value,
  className = '',
  showLabel = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevValueRef = useRef(value);

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

      // Calculate animation progress
      const progress = Math.min(1, (value - prevValueRef.current) * 0.1 + prevValueRef.current);
      prevValueRef.current = progress;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.4;

      // Draw background ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw coherence level
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (progress * Math.PI * 2));
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(64, 156, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(128, 200, 255, 0.8)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw glow effect
      const glowRadius = radius + 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(64, 156, 255, ${progress * 0.3})`;
      ctx.filter = 'blur(4px)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.filter = 'none';

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(128, 200, 255, ${progress})`;
      ctx.fill();

      // Draw quantum fluctuations
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const fluctRadius = radius * (0.6 + Math.sin(Date.now() / 1000 + i) * 0.1);
        const x = centerX + Math.cos(angle) * fluctRadius;
        const y = centerY + Math.sin(angle) * fluctRadius;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(128, 200, 255, ${progress * 0.5})`;
        ctx.fill();

        // Draw connection lines
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(64, 156, 255, ${progress * 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Request next frame
      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      {showLabel && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-xs opacity-70">Coherence</div>
          <div className="text-lg font-medium">
            {(value * 100).toFixed(1)}%
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CoherenceGauge;