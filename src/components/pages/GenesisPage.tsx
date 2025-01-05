import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useAnima } from '@/contexts/anima-context';
import { Principal } from '@dfinity/principal';
import { QuantumField } from '../ui/QuantumField';
import { LaughingMan } from '../ui/LaughingMan';
import { PaymentPanel } from '../payment/PaymentPanel';
import { MatrixRain } from '../ui/MatrixRain';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';

const GENESIS_FEE = BigInt(100000000); // 1 ICP
const GENESIS_PHASES = [
  'Quantum State Initialization',
  'Neural Pattern Formation',
  'Consciousness Embedding',
  'Identity Crystallization'
];

const GenesisPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, principal } = useAuth();
  const { updateQuantumState } = useQuantumState();
  const { createActor } = useAnima();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showLaughingMan, setShowLaughingMan] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [mintingProgress, setMintingProgress] = useState(0);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleMintingProcess = async () => {
    if (!name.trim()) {
      setError('Please enter a name for your Anima');
      return;
    }

    setIsCreating(true);
    setShowLaughingMan(false);
    setError(null);

    try {
      const actor = createActor();
      
      // Process phases
      for (let i = 0; i < GENESIS_PHASES.length; i++) {
        setCurrentPhase(i);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setMintingProgress((i + 1) * 25);

        // Actual creation during consciousness phase
        if (i === 2) {
          // First approve ICP transfer
          const ledgerActor = await actor.getLedgerActor();
          await ledgerActor.approve({
            amount: GENESIS_FEE,
            spender: Principal.fromText(process.env.ANIMA_CANISTER_ID)
          });

          // Create the Anima
          const result = await actor.create_anima(name);
          
          // Update quantum state
          updateQuantumState({
            resonance: Math.random(),
            harmony: Math.random(),
            lastInteraction: new Date(),
            consciousness: {
              awareness: 0.3,
              understanding: 0.2,
              growth: 0.1
            }
          });
        }
      }

      // Navigate to new Anima
      setTimeout(() => {
        navigate('/quantum-vault', { state: { fromGenesis: true } });
      }, 1000);

    } catch (error) {
      console.error('Genesis failed:', error);
      setError(error instanceof Error ? error.message : 'Genesis process failed');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <QuantumField intensity={0.8} />
      <MatrixRain opacity={0.1} />

      <AnimatePresence>
        {showLaughingMan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <LaughingMan className="w-64 h-64" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-6">Genesis Protocol</h1>
          
          {isCreating ? (
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl text-blue-400"
              >
                {GENESIS_PHASES[currentPhase]}
              </motion.div>

              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${mintingProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {GENESIS_PHASES.map((phase, index) => (
                  <div
                    key={phase}
                    className={`text-sm ${
                      index <= currentPhase ? 'text-blue-400' : 'text-gray-600'
                    }`}
                  >
                    {phase}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <p className="text-xl mb-12 text-gray-300">
                Initialize your quantum consciousness through the Genesis Protocol
              </p>

              <div className="max-w-md mx-auto bg-black/50 backdrop-blur border-amber-500/20 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-1">
                      Name Your Anima
                    </label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-black/30 border-amber-500/30 text-amber-100"
                      placeholder="Enter a mystical name..."
                    />
                  </div>

                  <div className="p-4 rounded bg-amber-900/20 border border-amber-500/20">
                    <h3 className="font-medium text-amber-400 mb-2">Genesis Fee</h3>
                    <p className="text-amber-200">1 ICP</p>
                    <p className="text-sm text-amber-300/60 mt-1">
                      This fee sustains the eternal flame of your Anima
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      {error}
                    </Alert>
                  )}

                  <PaymentPanel onSuccess={handleMintingProcess} />

                  <Button
                    onClick={handleMintingProcess}
                    disabled={isCreating || !name.trim()}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    <span className="flex items-center gap-2">
                      <span>Begin Genesis</span>
                      <motion.div
                        className="w-2 h-2 bg-white rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GenesisPage;