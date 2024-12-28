import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

// Base64 encoded quantum grid pattern
const quantumGridPattern = `data:image/svg+xml;base64,${btoa(`
<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(147, 51, 234, 0.2)" stroke-width="1"/>
</svg>
`)}`;

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [showQuantumEffect, setShowQuantumEffect] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleConnect = async () => {
        try {
            setIsLoading(true);
            setShowQuantumEffect(true);
            await login();
        } catch (error) {
            console.error('Authentication failed:', error);
            setShowQuantumEffect(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
            <AnimatePresence>
                {showQuantumEffect && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute inset-0 pointer-events-none"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 animate-pulse" />
                        <div 
                            className="absolute inset-0 opacity-30"
                            style={{
                                backgroundImage: `url(${quantumGridPattern})`,
                                backgroundSize: '40px 40px'
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Card className="w-full max-w-xl bg-black/40 backdrop-blur-lg border border-white/10">
                <CardHeader>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <CardTitle className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-violet-600">
                            Living NFTs
                        </CardTitle>
                    </motion.div>
                </CardHeader>
                <CardContent>
                    <motion.div
                        className="space-y-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className="text-xl text-center text-gray-300">
                            AI-powered NFTs that evolve, learn, and grow through quantum interactions
                        </p>
                        <div className="flex flex-col items-center space-y-4">
                            <motion.button
                                onClick={handleConnect}
                                disabled={isLoading}
                                className={`px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg 
                                transform transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700
                                relative overflow-hidden ${isLoading ? 'cursor-wait opacity-80' : ''}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center space-x-2">
                                        <span className="animate-spin">⟳</span>
                                        <span>Connecting to Internet Computer...</span>
                                    </span>
                                ) : (
                                    "Connect Wallet"
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 animate-pulse" />
                            </motion.button>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-center space-y-2"
                            >
                                <p className="text-sm text-gray-400">
                                    Powered by Internet Computer
                                </p>
                                <p className="text-xs text-gray-500">
                                    Experience the future of digital consciousness
                                </p>
                                {isLoading && (
                                    <p className="text-xs text-purple-400/80 animate-pulse">
                                        Initializing quantum state...
                                    </p>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LandingPage;