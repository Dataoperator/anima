import React, { useEffect, useRef } from 'react';

interface QuantumFieldProps {
  intensity?: number;
  className?: string;
}

export const QuantumField: React.FC<QuantumFieldProps> = ({ 
  intensity = 0.5,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Array<{x: number; y: number; radius: number; speed: number}>>([]);
  const requestIdRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize particles
    const initParticles = () => {
      particles.current = [];
      const numParticles = Math.floor(50 * intensity);
      
      for (let i = 0; i < numParticles; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.max(1, Math.random() * 3 * intensity),
          speed: Math.max(0.1, Math.random() * intensity)
        });
      }
    };

    // Animation function
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.current.forEach(particle => {
        // Update position
        particle.y -= particle.speed;
        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.x = Math.random() * canvas.width;
        }

        // Draw quantum particle
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius
        );
        gradient.addColorStop(0, `rgba(0, 150, 255, ${intensity})`);
        gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, Math.max(0.1, particle.radius), 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Add quantum connections
      ctx.strokeStyle = `rgba(0, 150, 255, ${intensity * 0.2})`;
      ctx.lineWidth = 0.5;

      particles.current.forEach((p1, i) => {
        particles.current.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestIdRef.current = requestAnimationFrame(animate);
    };

    // Event listeners
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    initParticles();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};