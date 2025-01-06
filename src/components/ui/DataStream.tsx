import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DataStreamProps {
  intensity: number;
  color: string;
}

export const DataStream: React.FC<DataStreamProps> = ({ intensity, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;

    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = new Array(columns).fill(0);

    const getRandomChar = () => {
      const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
      return chars[Math.floor(Math.random() * chars.length)];
    };

    let animationFrameId: number;

    const draw = () => {
      ctx.fillStyle = `rgba(0, 0, 0, ${0.1 - intensity * 0.05})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = getRandomChar();
        const x = i * 20;
        const y = drops[i] * 20;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, color]);

  return (
    <motion.div 
      className="w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          filter: `blur(0.5px) brightness(${1 + intensity * 0.5})`,
          opacity: 0.8 + intensity * 0.2
        }}
      />
    </motion.div>
  );
};