import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { useQuantumState } from '@/hooks/useQuantumState';
import { usePayment } from '@/hooks/usePayment';
import { QuantumField } from '@/components/ui/QuantumField';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/alert';

const GENESIS_PHASES = [
  { id: 'payment', name: 'Payment Verification', duration: 2000 },
  { id: 'quantum', name: 'Quantum Field Generation', duration: 3000 },
  { id: 'traits', name: 'Trait Manifestation', duration: 3000 },
  { id: 'completion', name: 'Birth Sequence', duration: 2000 }
];

export const AnimaGenesis: React.FC<{ name: string }> = ({ name }) => {
  const navigate = useNavigate();
  const { actor, principal } = useAuth();
  const { initiatePayment, verifyPayment } = usePayment();
  const [currentPhase, setCurrentPhase] = useState<string>(GENESIS_PHASES[0].id);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mintedAnima, setMintedAnima] = useState(null);

  useEffect(() => {
    if (!actor || !principal) {
      setError('Authentication required');
      return;
    }

    const performGenesis = async () => {
      setIsGenerating(true);
      setError(null);

      try {
        // Payment Phase
        setCurrentPhase('payment');
        const paymentResult = await initiatePayment({
          amount: BigInt(100000000), // 1 ICP
          memo: BigInt(Date.now()),
          toCanister: process.env.ANIMA_CANISTER_ID
        });

        await new Promise(resolve => setTimeout(resolve, GENESIS_PHASES[0].duration));
        setProgress(25);

        // Quantum Generation Phase
        setCurrentPhase('quantum');
        await verifyPayment(paymentResult.height);
        await new Promise(resolve => setTimeout(resolve, GENESIS_PHASES[1].duration));
        setProgress(50);

        // Trait Generation Phase
        setCurrentPhase('traits');
        const mintResult = await actor.mint_anima({
          name,
          owner: principal,
          payment_height: paymentResult.height
        });

        if ('Err' in mintResult) {
          throw new Error(mintResult.Err);
        }

        setMintedAnima(mintResult.Ok);
        await new Promise(resolve => setTimeout(resolve, GENESIS_PHASES[2].duration));
        setProgress(75);

        // Completion Phase
        setCurrentPhase('completion');
        await new Promise(resolve => setTimeout(resolve, GENESIS_PHASES[3].duration));
        setProgress(100);

        // Navigate to the new ANIMA
        setTimeout(() => {
          navigate(`/quantum-vault/${mintResult.Ok.token_id}`, {
            state: { fromGenesis: true }
          });
        }, 1000);

      } catch (err) {
        console.error('Genesis error:', err);
        setError(err instanceof Error ? err.message : 'Genesis failed');
      } finally {
        setIsGenerating(false);
      }
    };

    performGenesis();
  }, [actor, principal, name]);

  const getCurrentPhaseInfo = () => {
    switch (currentPhase) {
      case 'payment':
        return {
          title: 'Initializing Payment',
          description: 'Verifying quantum transaction...'
        };
      case 'quantum':
        return {
          title: 'Generating Quantum Field',
          description: 'Establishing dimensional resonance...'
        };
      case 'traits':
        return {
          title: 'Manifesting Traits',
          description: 'Natural patterns emerging...'
        };
      case 'completion':
        return {
          title: 'Birth Sequence',
          description: 'Your ANIMA is awakening...'
        };
      default:
        return {
          title: 'Processing',
          description: 'Please wait...'
        };
    }
  };

  const phaseInfo = getCurrentPhaseInfo();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      <QuantumField intensity={0.7} />
      
      <div className="relative z-10 max-w-xl w-full mx-4">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              {phaseInfo.title}
            </h1>
            <p className="text-gray-400 mt-2">
              {phaseInfo.description}
            </p>
          </div>

          <div className="space-y-8">
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="flex justify-center">
              {isGenerating && (
                <LoadingSpinner size="lg" className="text-purple-400" />
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {GENESIS_PHASES.map((phase, index) => (
                <div
                  key={phase.id}
                  className={`text-sm text-center ${
                    currentPhase === phase.id
                      ? 'text-purple-400 font-medium'
                      : progress >= ((index + 1) * 25)
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                >
                  {phase.name}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};