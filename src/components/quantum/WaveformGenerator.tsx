import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface WaveformGeneratorProps {
  frequency: number;
  amplitude: number;
  phaseShift: number;
  className?: string;
  color?: string;
  resolution?: number;
  harmonics?: boolean;
}

interface WaveformMethods {
  updateWaveform: (params: {
    frequency: number;
    amplitude: number;
    phaseShift: number;
  }) => void;
}

export const WaveformGenerator = forwardRef<WaveformMethods, WaveformGeneratorProps>(({
  frequency = 1,
  amplitude = 0.5,
  phaseShift = 0,
  className = '',
  color = 'rgb(64, 156, 255)',
  resolution = 200,
  harmonics = true
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef({ frequency, amplitude, phaseShift });
  const timeRef = useRef(0);

  useImperativeHandle(ref, () => ({
    updateWaveform: (params) => {
      paramsRef.current = params;
    }
  }));

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const drawWave = () => {
      const canvas = canvasRef.current!;
      const { width, height } = canvas.getBoundingClientRect();

      // Set canvas resolution
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      const { frequency, amplitude, phaseShift } = paramsRef.current;
      const centerY = height / 2;

      // Draw main waveform
      ctx.beginPath();
      for (let x = 0; x <= resolution; x++) {
        const t = (x / resolution) * Math.PI * 2;
        const normalX = (x / resolution) * width;
        const y = centerY + (height * 0.4 * amplitude * Math.sin(
          t * frequency + timeRef.current + phaseShift
        ));

        x === 0 ? ctx.moveTo(normalX, y) : ctx.lineTo(normalX, y);
      }

      // Apply gradient stroke
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, `${color}40`);
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, `${color}40`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw harmonic waves if enabled
      if (harmonics) {
        for (let h = 2; h <= 3; h++) {
          ctx.beginPath();
          for (let x = 0; x <= resolution; x++) {
            const t = (x / resolution) * Math.PI * 2;
            const normalX = (x / resolution) * width;
            const harmonicAmplitude = amplitude / (h * 2);
            const y = centerY + (height * 0.4 * harmonicAmplitude * Math.sin(
              t * frequency * h + timeRef.current + phaseShift
            ));

            x === 0 ? ctx.moveTo(normalX, y) : ctx.lineTo(normalX, y);
          }

          ctx.strokeStyle = `${color}${Math.floor(40 / h).toString(16)}`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw quantum fluctuations
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * width;
        const baseY = centerY + (height * 0.4 * amplitude * Math.sin(
          (x / width) * Math.PI * 2 * frequency + timeRef.current + phaseShift
        ));
        const fluctY = baseY + (Math.random() - 0.5) * 10;

        ctx.beginPath();
        ctx.arc(x, fluctY, 1, 0, Math.PI * 2);
        ctx.fillStyle = `${color}40`;
        ctx.fill();
      }

      // Update time
      timeRef.current += 0.05;
      requestAnimationFrame(drawWave);
    };

    const animationFrame = requestAnimationFrame(drawWave);
    return () => cancelAnimationFrame(animationFrame);
  }, [color, resolution, harmonics]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Overlay quantum information */}
      <div className="absolute bottom-2 right-2 text-xs text-white/70 bg-black/20 px-2 py-1 rounded">
        <div>f: {frequency.toFixed(2)}Hz</div>
        <div>φ: {(phaseShift * 180 / Math.PI).toFixed(1)}°</div>
      </div>
    </div>
  );
});

export default WaveformGenerator;