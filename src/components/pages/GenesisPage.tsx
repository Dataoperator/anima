import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { usePayment } from '@/contexts/payment-context';
import { useAnima } from '@/hooks/useAnima';
import { useQuantumState } from '@/hooks/useQuantumState';
import { Card } from '@/components/ui/card';
import { QuantumField } from '@/components/quantum/QuantumField';
import { GenesisRitual } from '@/components/genesis/GenesisRitual';
import { LoadingFallback } from '@/components/ui/LoadingFallback';
import { MatrixRain } from '@/components/ui/MatrixRain';
import { TransactionMonitor } from '@/components/transactions/TransactionMonitor';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

const MINT_COST = BigInt(100_000_000); // 1 ICP
const MIN_BALANCE = BigInt(110_000_000); // 1.1 ICP (including fee buffer)

export const GenesisPage: React.FC = () => {
  const navigate = useNavigate();
  const { identity } = useAuth();
  const { balance, makePayment, isLoading: isPaymentLoading } = usePayment();
  const { mintAnima, isLoading: isMintLoading } = useAnima();
  const { initializeQuantumState } = useQuantumState();
  
  const [currentStep, setCurrentStep] = useState<'preparation' | 'payment' | 'ritual'>('preparation');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check minimum balance requirement
    if (balance !== null && balance < MIN_BALANCE) {
      setError('Insufficient balance for ANIMA creation');
    } else {
      setError(null);
    }
  }, [balance]);

  const handleMintInitiation = async () => {
    if (!identity || isProcessing) return;
    
    try {
      setIsProcessing(true);
      setCurrentStep('payment');

      // Process payment
      const payment = await makePayment({
        to: process.env.ANIMA_TREASURY_PRINCIPAL!,
        amount: MINT_COST,
        memo: BigInt(Date.now())
      });

      setTransactionHash(payment.blockIndex.toString());
      setCurrentStep('ritual');

      // Initialize quantum state
      await initializeQuantumState();

      // Mint ANIMA
      const anima = await mintAnima({
        transactionHash: payment.blockIndex.toString(),
        identity: identity
      });

      // Navigate to the new ANIMA's page
      navigate(`/anima/${anima.id}`);

    } catch (error) {
      console.error('Minting failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to create ANIMA');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isPaymentLoading || isMintLoading) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white relative">
        <MatrixRain speed={30} density={0.5} />
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-black/60 backdrop-blur-lg border-cyan-900/50 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
                    ANIMA Genesis
                  </h1>
                  
                  <p className="text-gray-400 mb-6">
                    Create your unique ANIMA entity through the quantum-enhanced genesis ritual.
                  </p>

                  {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Creation Cost</span>
                      <span className="text-cyan-400">{(Number(MINT_COST) / 100_000_000).toFixed(2)} ICP</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Your Balance</span>
                      <span className="text-cyan-400">
                        {balance ? (Number(balance) / 100_000_000).toFixed(2) : '---'} ICP
                      </span>
                    </div>

                    <button
                      onClick={handleMintInitiation}
                      disabled={!!error || isProcessing || balance === null || balance < MIN_BALANCE}
                      className={`w-full px-6 py-3 rounded-lg transition-colors ${
                        error || isProcessing || balance === null || balance < MIN_BALANCE
                          ? 'bg-gray-700 cursor-not-allowed'
                          : 'bg-cyan-600 hover:bg-cyan-700'
                      }`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </span>
                      ) : (
                        'Begin Genesis'
                      )}
                    </button>
                  </div>
                </div>

                <div className="relative aspect-square">
                  <QuantumField className="absolute inset-0" />
                </div>
              </div>
            </Card>

            <AnimatePresence mode="wait">
              {currentStep === 'ritual' && transactionHash && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8"
                >
                  <GenesisRitual transactionHash={transactionHash} />
                </motion.div>
              )}
            </AnimatePresence>

            {transactionHash && (
              <div className="mt-8">
                <TransactionMonitor transactionHash={transactionHash} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default GenesisPage;