import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  className?: string;
  color?: string;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ 
  className = '',
  color = '#00ff00'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters (mix of katakana and other symbols)
    const chars = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');

    // Drop settings
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Animation settings
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    // Draw function
    const draw = (timestamp: number) => {
      if (!ctx) return;

      // Control frame rate
      if (timestamp - lastTime < interval) {
        requestAnimationFrame(draw);
        return;
      }
      lastTime = timestamp;

      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text
      ctx.fillStyle = color;
      ctx.font = fontSize + 'px monospace';

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Calculate position
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw character with varying opacity
        const alpha = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = color.replace(')', `,${alpha})`).replace('rgb', 'rgba');
        ctx.fillText(char, x, y);

        // Reset when off screen or randomly
        if (y > canvas.height || Math.random() > 0.99) {
          drops[i] = 0;
        }

        // Move drop
        drops[i]++;
      }

      requestAnimationFrame(draw);
    };

    // Start animation
    requestAnimationFrame(draw);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};