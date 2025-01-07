import React, { useEffect, useRef } from 'react';
import * as QRCodeLib from 'qrcode/lib/browser';

interface QRCodeProps {
  value: string;
  size?: number;
  level?: string;
  className?: string;
}

export const QRCodeCanvas: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  level = 'H',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCodeLib.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: level as any,
      color: {
        dark: '#8B5CF6', // Tailwind purple-500
        light: '#FFFFFF'
      }
    }).catch(error => {
      console.error('QR Code generation error:', error);
    });
  }, [value, size, level]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={size}
      height={size}
    />
  );
};

export default QRCodeCanvas;