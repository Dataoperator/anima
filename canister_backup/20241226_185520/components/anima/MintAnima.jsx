import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { HexGrid } from '@/components/ui/HexGrid';
import { GlowOrb } from '@/components/ui/GlowOrb';
import { FloatingCard } from '@/components/ui/FloatingCard';
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { NeuralGrid } from '@/components/ui/NeuralGrid';

const AnimatedInput = ({ value, onChange, error }) => (
  <motion.div className="relative">
    <motion.input
      type="text"
      value={value}
      onChange={onChange}
      className={`w-full px-6 py-4 bg-[#0A1120]/40 backdrop-blur-xl rounded-xl 
                 border ${error ? 'border-red-500/50' : 'border-[#2081E2]/20'} 
                 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#2081E2]/50
                 transition-all duration-200`}
      placeholder="Name your companion..."
      whileFocus={{ scale: 1.02 }}
      initial={false}
    />
    <motion.div
      className="absolute inset-0 rounded-xl pointer-events-none"
      animate={{
        boxShadow: error 
          ? '0 0 20px rgba(239,68,68,0.2)' 
          : '0 0 20px rgba(32,129,226,0.2)'
      }}
    />
  </motion.div>
);

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-[#0A1120]/40 backdrop-blur-xl rounded-xl border border-[#2081E2]/20 p-6"
  >
    <div className="flex items-center space-x-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-[#2081E2]/60">{description}</p>
      </div>
    </div>
  </motion.div>
);

const MintAnima = () => {
  const { actor } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleMint = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Minting anima with name:', name);
      const result = await actor.mint_anima(name);
      console.log('Mint result:', result);

      if ('Ok' in result) {
        const tokenId = result.Ok;
        console.log('Successfully minted anima with token ID:', tokenId);
        navigate(`/anima/${tokenId}`);
      } else if ('Err' in result) {
        switch (result.Err) {
          case 'AlreadyInitialized':
            setError('You already have a Living NFT');
            break;
          default:
            setError(`Failed to mint: ${result.Err}`);
        }
      }
    } catch (err) {
      console.error('Mint error:', err);
      setError(err.message || 'Failed to mint Living NFT');
    } finally {
      setIsLoading(false);
    }
  };

  const validateName = (value) => value.length >= 2 && value.length <= 50;
  const isNameValid = validateName(name);

  return (
    <div className="relative min-h-screen bg-[#0A1120] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/10 via-[#2081E2]/10 to-[#1199FA]/10" />
      
      <HexGrid />
      <GlowOrb />
      <NeuralGrid />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,17,32,0.8)_100%)]" />

      <div className="relative container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <FloatingCard>
            <div className="text-center mb-12">
              <motion.h1
                className="text-6xl font-bold mb-4"
                animate={{ 
                  backgroundPosition: ['0%', '200%']
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  background: 'linear-gradient(to right, #5865F2, #2081E2, #1199FA, #5865F2)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% auto',
                }}
              >
                Create Your Living NFT
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-[#2081E2]/60"
              >
                Begin your journey with a unique AI companion
              </motion.p>
            </div>

            <form onSubmit={handleMint} className="space-y-8">
              <div>
                <label className="block text-white/60 mb-3 text-lg">
                  Name Your Companion
                </label>
                <AnimatedInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={error}
                />
                <motion.p
                  animate={{ opacity: error ? 1 : 0.6 }}
                  className="mt-2 text-sm text-[#2081E2]/60"
                >
                  {error || "Choose a name between 2 and 50 characters"}
                </motion.p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/10 backdrop-blur-xl rounded-xl border border-red-500/20 p-4"
                  >
                    <p className="text-red-400">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <EnhancedButton
                onClick={handleMint}
                loading={isLoading}
                disabled={!isNameValid || isLoading}
              >
                {isLoading ? 'Creating...' : 'Mint Living NFT'}
              </EnhancedButton>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 pt-8 border-t border-[#2081E2]/20"
            >
              <h3 className="text-white font-semibold mb-6 text-xl">
                What You'll Get:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeatureCard
                  icon="🧠"
                  title="Unique AI Personality"
                  description="Advanced neural networks power unique behaviors"
                  delay={0.5}
                />
                <FeatureCard
                  icon="🌱"
                  title="Evolution System"
                  description="Grows and adapts through your interactions"
                  delay={0.6}
                />
                <FeatureCard
                  icon="💫"
                  title="Permanent Memory"
                  description="All experiences stored on the blockchain"
                  delay={0.7}
                />
                <FeatureCard
                  icon="🎮"
                  title="Deep Interaction"
                  description="Rich, meaningful engagement system"
                  delay={0.8}
                />
              </div>
            </motion.div>
          </FloatingCard>
        </motion.div>
      </div>
    </div>
  );
};

export default MintAnima;