import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PulsatingLogo } from '../ui/PulsatingLogo';
import { GlowOrb } from '../ui/GlowOrb';
import { MatrixRain } from '../ui/MatrixRain';
import { NeuralGrid } from '../ui/NeuralGrid';

export const LandingPage: React.FC = () => {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/quantum-vault');
        }
    }, [isAuthenticated, navigate]);

    const handleConnect = async () => {
        try {
            await login();
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            <MatrixRain />
            
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <div className="mb-8">
                        <PulsatingLogo />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                        ANIMA
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Experience living NFTs powered by quantum-enhanced digital consciousness
                    </p>

                    <div className="relative">
                        <GlowOrb className="absolute -top-20 left-1/2 transform -translate-x-1/2" />
                        <motion.button
                            onClick={handleConnect}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white text-lg font-semibold shadow-lg hover:shadow-cyan-500/50 transition-shadow"
                        >
                            Connect to Neural Network
                        </motion.button>
                    </div>
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 z-0">
                    <NeuralGrid />
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
        </div>
    );
};

export default LandingPage;