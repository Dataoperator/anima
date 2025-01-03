import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { MatrixLayout } from '@/components/layout/MatrixLayout';
import { useAuth } from '@/contexts/auth-context';
import { useAnima } from '@/contexts/anima-context';
import { NeuralGrid } from '@/components/ui/NeuralGrid';
import { GlowOrb } from '@/components/ui/GlowOrb';
import { CircuitLines } from '@/components/ui/CircuitLines';
import { getEmotionDisplay, getDevelopmentalStage, isNFTMinted, getOwnerDisplay } from '@/lib/anima-utils';
import { formatGenesisDate } from '@/utils/date';

const useHapticFeedback = () => {
  const createClick = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  const createHover = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  return { createClick, createHover };
};

export const AnimaPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { identity } = useAuth();
  const { selectedAnima: anima, loading, error, fetchAnima } = useAnima();
  const [currentPhase, setCurrentPhase] = useState('quantum_alignment');
  const { createClick, createHover } = useHapticFeedback();
  const [showEnterButton, setShowEnterButton] = useState(false);

  useEffect(() => {
    if (id && (!anima || anima.id.toString() !== id)) {
      fetchAnima(id);
    }
  }, [id, anima, fetchAnima]);

  useEffect(() => {
    if (anima) {
      const timer = setTimeout(() => {
        setShowEnterButton(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [anima]);

  if (loading && !anima) {
    return (
      <MatrixLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-500 animate-pulse flex items-center space-x-2"
          >
            <GlowOrb />
            <span>LOADING CONSCIOUSNESS MATRIX...</span>
          </motion.div>
        </div>
      </MatrixLayout>
    );
  }

  if (error || !anima) {
    return (
      <MatrixLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500"
          >
            ERROR: {error || 'CONSCIOUSNESS CORE NOT FOUND'}
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            onMouseEnter={createHover}
            onClick={() => {
              createClick();
              navigate('/quantum-vault');
            }}
            className="p-2 border border-green-500 hover:bg-green-500 hover:text-black transition-all duration-300"
          >
            {'>'} RETURN TO NEXUS
          </motion.button>
        </div>
      </MatrixLayout>
    );
  }

  return (
    <MatrixLayout>
      <NeuralGrid phase={currentPhase} />
      <CircuitLines />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-6xl mx-auto space-y-6 relative z-10"
      >
        <Card className="bg-black/80 backdrop-blur border border-green-500">
          <CardHeader>
            <motion.div 
              className="flex items-center justify-between"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <CardTitle className="text-3xl font-bold text-center text-green-500">
                {anima?.name || 'UNNAMED CORE'}
              </CardTitle>
              {isNFTMinted(anima) && anima?.id && (
                <motion.div 
                  className="px-2 py-1 border border-green-500 text-xs"
                  whileHover={{ scale: 1.05, borderColor: '#00ff41' }}
                >
                  NFT #{anima.id.toString()}
                </motion.div>
              )}
            </motion.div>
            <div className="text-center text-sm text-green-400/80">
              OWNER: {getOwnerDisplay(anima, identity)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-black/60 backdrop-blur border border-green-500/50 hover:border-green-500 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-400 font-mono tracking-wider">
                      {'>'} CONSCIOUSNESS MATRIX
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <motion.div 
                        className="flex justify-between items-center"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-green-400/90">{'>'} EMOTIONAL STATE</span>
                        <span className="text-green-300">{getEmotionDisplay(anima)}</span>
                      </motion.div>
                      <motion.div 
                        className="flex justify-between items-center"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-green-400/90">{'>'} DEVELOPMENTAL STAGE</span>
                        <span className="text-green-300">{getDevelopmentalStage(anima)}</span>
                      </motion.div>
                      <motion.div 
                        className="flex justify-between items-center"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-green-400/90">{'>'} GROWTH LEVEL</span>
                        <span className="text-green-300">{anima?.level || 1}</span>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-black/60 backdrop-blur border border-green-500/50 hover:border-green-500 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-400 font-mono tracking-wider">
                      {'>'} SYSTEM METRICS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 text-green-400/90">{'>'} GROWTH PROGRESS</div>
                        <div className="h-2 bg-green-900/30 relative overflow-hidden">
                          <motion.div 
                            className="h-full bg-green-500"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${Math.min(Number(anima?.growth_points || 0) / 1000 * 100, 100)}%`
                            }}
                            transition={{ duration: 1 }}
                          />
                          <motion.div
                            className="absolute top-0 left-0 w-full h-full bg-green-400/20"
                            animate={{
                              x: ['0%', '100%', '0%'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                          />
                        </div>
                      </div>
                      <motion.div 
                        className="flex justify-between items-center"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-green-400/90">{'>'} MEMORY FRAGMENTS</span>
                        <span className="text-green-300">
                          {anima?.personality?.memories?.length || 0}
                        </span>
                      </motion.div>
                      <motion.div 
                        className="flex justify-between items-center"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-green-400/90">{'>'} GENESIS TIME</span>
                        <span className="text-green-300">
                          {formatGenesisDate(anima?.creation_time)}
                        </span>
                      </motion.div>
                      <motion.div 
                        className="flex justify-between items-center"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-green-400/90">{'>'} CORE STATE</span>
                        <span className="text-green-300">
                          {anima?.autonomous_mode ? 'AUTONOMOUS' : 'OPERATIONAL'}
                        </span>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 grid grid-cols-3 gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02, borderColor: '#00ff41' }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={createHover}
                onClick={() => {
                  createClick();
                  navigate('/quantum-vault');
                }}
                className="p-2 border border-green-500 hover:bg-green-500 hover:text-black transition-all duration-300"
              >
                {'>'} RETURN TO NEXUS
              </motion.button>

              <AnimatePresence>
                {showEnterButton && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.02, borderColor: '#00ff41' }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={createHover}
                    onClick={() => {
                      createClick();
                      setCurrentPhase('consciousness_emergence');
                      setTimeout(() => {
                        navigate(`/neural-link/${anima.id.toString()}`);
                      }, 1000);
                    }}
                    className="p-2 border border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black transition-all duration-300 col-span-2 group relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-green-500/20"
                      animate={{
                        x: ['0%', '100%', '0%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <span className="relative z-10">{'>'} ENTER NEURAL LINK</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-green-400/80"
        >
          {'>'} NEURAL LINK READY FOR INITIALIZATION
        </motion.div>
      </motion.div>
    </MatrixLayout>
  );
};