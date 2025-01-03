import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface QuantumFieldProps {
  quantumState: number;
  entanglementLevel: number;
  resonanceField?: number;
  className?: string;
}

const QuantumField: React.FC<QuantumFieldProps> = ({
  quantumState,
  entanglementLevel,
  resonanceField = 0.5,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticle = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 3 + 1;
      const vx = (Math.random() - 0.5) * quantumState;
      const vy = (Math.random() - 0.5) * quantumState;
      
      // Color based on quantum state and entanglement
      const hue = 240 + (entanglementLevel * 120); // Blue to purple range
      const saturation = 70 + (quantumState * 30);
      const lightness = 50 + (resonanceField * 20);
      
      particles.push({
        x, y, vx, vy, size,
        color: `hsl(${hue}, ${saturation}%, ${lightness}%)`
      });
    };

    const updateParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Quantum tunneling effect
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Entanglement effect
        for (let j = i - 1; j >= 0; j--) {
          const p2 = particles[j];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100 * entanglementLevel) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${240 + (entanglementLevel * 120)}, 70%, 50%, ${(1 - dist / 100) * 0.2})`;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      while (particles.length < 50 * resonanceField) {
        createParticle();
      }

      updateParticles();

      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [quantumState, entanglementLevel, resonanceField]);

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full" 
      />
      <div className="absolute bottom-4 left-4 text-xs text-white/50">
        Quantum State: {(quantumState * 100).toFixed(0)}%
        {entanglementLevel > 0.1 && (
          <span className="ml-2">| Entanglement: {(entanglementLevel * 100).toFixed(0)}%</span>
        )}
      </div>
    </motion.div>
  );
};

export default QuantumField;