import React from 'react';
import { motion } from 'framer-motion';
import { ConnectionMode } from '@/services/realtime';

interface ConnectionStatusProps {
    mode: ConnectionMode;
    className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ mode, className = '' }) => {
    const isWebSocket = mode === ConnectionMode.WEBSOCKET;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${
                isWebSocket 
                    ? 'bg-quantum-purple/20 text-quantum-purple' 
                    : 'bg-quantum-pink/20 text-quantum-pink'
            } ${className}`}
        >
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`w-2 h-2 rounded-full ${
                    isWebSocket 
                        ? 'bg-quantum-purple' 
                        : 'bg-quantum-pink'
                }`}
            />
            <span>
                {isWebSocket ? 'Real-time WebSocket' : 'Polling Mode'}
            </span>
            {!isWebSocket && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-quantum-pink/70"
                >
                    (Attempting WebSocket reconnection...)
                </motion.span>
            )}
        </motion.div>
    );
};