import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HexCell {
  x: number;
  y: number;
  value: number;
  active: boolean;
  quantum: boolean;
}

interface QuantumHexGridProps {
  className?: string;
  cellSize?: number;
  gridSize?: number;
  pulseColor?: string;
  quantumState?: number;
}

export const QuantumHexGrid: React.FC<QuantumHexGridProps> = ({
  className = '',
  cellSize = 30,
  gridSize = 10,
  pulseColor = 'cyan',
  quantumState = 0.5
}) => {
  const [cells, setCells] = useState<HexCell[]>([]);
  const [quantumCells, setQuantumCells] = useState<number[]>([]);
  const requestRef = useRef<number>();
  const timeRef = useRef<number>(0);

  useEffect(() => {
    // Initialize hex grid
    const initialCells: HexCell[] = [];
    for (let q = -gridSize; q <= gridSize; q++) {
      for (let r = -gridSize; r <= gridSize; r++) {
        // Hex grid coordinate system
        const s = -q - r;
        if (Math.abs(s) <= gridSize) {
          initialCells.push({
            x: q * cellSize * 1.5,
            y: (r + q/2) * cellSize * Math.sqrt(3),
            value: Math.random(),
            active: Math.random() > 0.5,
            quantum: false
          });
        }
      }
    }
    setCells(initialCells);

    // Quantum cell animation
    const animate = (time: number) => {
      timeRef.current = time * 0.001;
      
      setCells(prevCells => 
        prevCells.map(cell => ({
          ...cell,
          value: Math.sin(timeRef.current + cell.x * 0.01 + cell.y * 0.01) * 0.5 + 0.5,
          quantum: quantumCells.includes(prevCells.indexOf(cell))
        }))
      );

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [cellSize, gridSize]);

  // Quantum state effects
  useEffect(() => {
    const interval = setInterval(() => {
      const newQuantumCells = Array.from({ length: Math.floor(cells.length * quantumState) }, 
        () => Math.floor(Math.random() * cells.length)
      );
      setQuantumCells(newQuantumCells);
    }, 2000);

    return () => clearInterval(interval);
  }, [cells.length, quantumState]);

  const hexagonPoints = (size: number): string => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      points.push(`${size * Math.cos(angle)},${size * Math.sin(angle)}`);
    }
    return points.join(' ');
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg 
        className="w-full h-full"
        viewBox={`${-gridSize * cellSize * 2} ${-gridSize * cellSize * 2} ${gridSize * cellSize * 4} ${gridSize * cellSize * 4}`}
      >
        <g transform={`translate(${gridSize * cellSize}, ${gridSize * cellSize})`}>
          {cells.map((cell, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: cell.active ? 1 : 0.3,
                scale: cell.quantum ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                duration: cell.quantum ? 2 : 0.5,
                repeat: cell.quantum ? Infinity : undefined
              }}
              transform={`translate(${cell.x}, ${cell.y})`}
            >
              <polygon
                points={hexagonPoints(cellSize * 0.95)}
                fill={`rgba(${pulseColor === 'cyan' ? '6, 182, 212' : '124, 58, 237'}, ${cell.value * 0.2})`}
                stroke={`rgba(${pulseColor === 'cyan' ? '6, 182, 212' : '124, 58, 237'}, ${cell.quantum ? 0.8 : 0.3})`}
                strokeWidth={cell.quantum ? 2 : 1}
              />
              
              {cell.quantum && (
                <motion.circle
                  r={cellSize * 0.2}
                  fill={`rgba(${pulseColor === 'cyan' ? '6, 182, 212' : '124, 58, 237'}, 0.5)`}
                  animate={{
                    r: [cellSize * 0.2, cellSize * 0.4, cellSize * 0.2],
                    opacity: [0.8, 0.2, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.g>
          ))}
        </g>
      </svg>
    </div>
  );
};