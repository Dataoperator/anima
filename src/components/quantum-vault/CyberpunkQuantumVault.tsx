import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, 
  Shield, 
  Sparkles, 
  Loader, 
  AlertTriangle,
  WalletIcon 
} from 'lucide-react';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { DataStream } from '../ui/DataStream';
import { CyberGlowText } from '../ui/CyberGlowText';
import { MatrixRain } from '../ui/MatrixRain';
import { useQuantum } from '@/contexts/quantum-context';
import { useAuth } from '@/contexts/auth-context';
import { useGenesisInitialization } from '@/hooks/useGenesisInitialization';
import { useICPLedger } from '@/hooks/useICPLedger';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PaymentModal } from '../payment/PaymentModal';

// Uninitialized state component
const UninitializedState: React.FC<{
  onInitialize: () => void;
  error: string | null;
  isChecking: boolean;
}> = ({ onInitialize, error, isChecking }) => {
  const { ledger } = useICPLedger();
  const [balance, setBalance] = useState<string>('0');
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const loadBalance = async () => {
      if (ledger) {
        try {
          const icpBalance = await ledger.getBalance();
          setBalance((Number(icpBalance) / 100_000_000).toFixed(2));
        } catch (err) {
          console.error('Failed to load balance:', err);
        }
      }
    };
    loadBalance();
  }, [ledger]);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <DataStream className="opacity-10" />
        <MatrixRain opacity={0.05} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto space-y-12"
        >
          <CyberGlowText>
            <h1 className="text-5xl font-bold mb-4">Quantum Vault</h1>
          </CyberGlowText>
          
          {/* Matrix-style Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Wallet Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-black/30 backdrop-blur border border-cyan-500/20 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-cyan-400 mb-4">Wallet Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">ICP Balance</span>
                  <span className="text-cyan-300">{balance} ICP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Required</span>
                  <span className="text-amber-400">1.00 ICP</span>
                </div>
                {Number(balance) < 1 && (
                  <Button
                    onClick={() => setShowPayment(true)}
                    className="w-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30"
                  >
                    <WalletIcon className="w-4 h-4 mr-2" />
                    Add Funds
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Quantum Field Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-black/30 backdrop-blur border border-purple-500/20 rounded-lg p-6"
            >
              <h2 className="text-xl font-bold text-purple-400 mb-4">Quantum Field</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className="text-purple-300">Awaiting Initialization</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Field Strength</span>
                  <span className="text-purple-300">0%</span>
                </div>
                <Button
                  onClick={onInitialize}
                  disabled={isChecking || Number(balance) < 1}
                  className="w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/30"
                >
                  {isChecking ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Checking Prerequisites...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Initialize Genesis
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Payment Modal */}
          {showPayment && (
            <PaymentModal
              onClose={() => setShowPayment(false)}
              onSuccess={() => {
                setShowPayment(false);
                // Refresh balance
                if (ledger) {
                  ledger.getBalance().then(bal => 
                    setBalance((Number(bal) / 100_000_000).toFixed(2))
                  );
                }
              }}
            />
          )}

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Genesis Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Quantum Effect Overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15), transparent 70%)`
        }}
      />
    </div>
  );
};

const CyberpunkQuantumVault: React.FC = () => {
  const { state: quantumState, isInitialized } = useQuantum();
  const { checkPrerequisites, isChecking, error: genesisError, isReady } = useGenesisInitialization();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showKeyring, setShowKeyring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🌟 Quantum Vault mounting...");
    console.log("Initialization status:", { isInitialized, quantumState });

    return () => {
      console.log("🔄 Quantum Vault cleanup");
    };
  }, [isInitialized, quantumState]);

  const handleGenesisStart = async () => {
    try {
      await checkPrerequisites();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start genesis');
    }
  };

  // If not initialized, show the enhanced uninitialized state
  if (!isInitialized || !quantumState) {
    return (
      <UninitializedState
        onInitialize={handleGenesisStart}
        error={error}
        isChecking={isChecking}
      />
    );
  }

  // Rest of the initialized state component remains the same...
  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-gray-900 text-white relative overflow-hidden">
        {/* Previous initialized state JSX */}
      </div>
    </ErrorBoundary>
  );
};

export default CyberpunkQuantumVault;