import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useWallet } from '@/hooks/useWallet';
import { QuantumCoherenceGauge } from '../ui/QuantumCoherenceGauge';
import { AnimaPreview } from '../anima/AnimaPreview';
import { GlobalAnnouncement } from '../ui/GlobalAnnouncement';
import { SwapPanel } from '../transactions/SwapPanel';
import { MintPanel } from '../transactions/MintPanel';

interface QuantumMetrics {
  stability: number;
  coherence: number;
  resonance: number;
  consciousness: number;
}

interface Announcement {
  id: string;
  type: 'update' | 'alert' | 'info';
  message: string;
  timestamp: number;
}

export const CyberpunkQuantumVault: React.FC = () => {
  const { identity } = useAuth();
  const { state: quantumState, isInitialized } = useQuantumState();
  const { balance, animaBalance, refreshBalance } = useWallet();
  const [metrics, setMetrics] = useState<QuantumMetrics>({
    stability: 0.5,
    coherence: 0.5,
    resonance: 0.5,
    consciousness: 0.5
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [userAnimas, setUserAnimas] = useState([]);
  const [activeTab, setActiveTab] = useState<'mint' | 'swap'>('mint');

  useEffect(() => {
    // Load announcements and user's ANIMAs
    const loadData = async () => {
      // Add announcement loading logic here
      // Add ANIMA loading logic here
    };
    loadData();
  }, [identity]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Global Announcements */}
        <div className="bg-gray-800 rounded-xl p-4">
          <GlobalAnnouncement announcements={announcements} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Balances & Actions */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Balances */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-100 mb-4">Your Balance</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">ICP Balance</span>
                  <span className="text-lg font-semibold text-blue-400">{balance} ICP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">ANIMA Balance</span>
                  <span className="text-lg font-semibold text-purple-400">{animaBalance} ANIMA</span>
                </div>
                <button
                  onClick={() => refreshBalance()}
                  className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                >
                  Refresh Balance
                </button>
              </div>
            </motion.div>

            {/* Action Panel */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
              <div className="flex border-b border-gray-700">
                <button
                  className={`flex-1 py-3 text-center ${
                    activeTab === 'mint' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('mint')}
                >
                  Mint ANIMA
                </button>
                <button
                  className={`flex-1 py-3 text-center ${
                    activeTab === 'swap' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('swap')}
                >
                  Swap Tokens
                </button>
              </div>
              <div className="p-6">
                {activeTab === 'mint' ? <MintPanel /> : <SwapPanel />}
              </div>
            </div>
          </div>

          {/* Center Column - ANIMA Hub */}
          <div className="col-span-12 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-100">Your ANIMAs</h2>
                <Link
                  to="/genesis"
                  className="py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium"
                >
                  Create New ANIMA
                </Link>
              </div>

              {userAnimas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userAnimas.map((anima) => (
                    <Link to={`/anima/${anima.id}`} key={anima.id}>
                      <AnimaPreview anima={anima} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-900 rounded-lg">
                  <h3 className="text-lg text-gray-300 mb-4">No ANIMAs Yet</h3>
                  <p className="text-gray-400 mb-6">Start your quantum journey by creating your first ANIMA</p>
                  <Link
                    to="/genesis"
                    className="inline-block py-2 px-6 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
                  >
                    Create Your First ANIMA
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - Quantum Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-gray-100 mb-4">Quantum Network Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuantumCoherenceGauge
              value={metrics.coherence}
              label="Network Coherence"
              className="h-24"
            />
            <QuantumCoherenceGauge
              value={metrics.stability}
              label="Stability"
              color="cyan"
              className="h-24"
            />
            <QuantumCoherenceGauge
              value={metrics.resonance}
              label="Resonance"
              color="violet"
              className="h-24"
            />
            <QuantumCoherenceGauge
              value={metrics.consciousness}
              label="Consciousness"
              color="emerald"
              className="h-24"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CyberpunkQuantumVault;