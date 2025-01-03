import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { Terminal, Network, Binary, Brain, Cpu, Sparkles, Power } from 'lucide-react';
import { LaughingMan } from '@/components/ui/LaughingMan';
import NeuralInterface from '@/components/ui/NeuralInterface';
import { MatrixRain } from '@/components/ui/MatrixRain';

const QuantumVault = () => {
  const { isAuthenticated, login, principal } = useAuth();
  const [jackingIn, setJackingIn] = useState(false);

  const handleJackIn = async () => {
    try {
      setJackingIn(true);
      await login();
    } catch (error) {
      console.error('Neural link failed:', error);
    } finally {
      setJackingIn(false);
    }
  };

  const ConnectionStatus = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-4 text-cyan-400 bg-black/60 px-6 py-3 rounded-lg 
                 border border-cyan-500/20 backdrop-blur-md"
    >
      <div className="relative">
        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-50" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-cyan-500/70">Neural Link Status</span>
        <span className="font-mono">CONNECTED: {principal?.toString().slice(0, 8)}...</span>
      </div>
    </motion.div>
  );

  const JackInButton = () => (
    <motion.button
      onClick={handleJackIn}
      disabled={jackingIn}
      className="relative overflow-hidden px-12 py-6 rounded-lg
                bg-black/80 border border-cyan-500/30 text-cyan-400
                hover:bg-cyan-900/20 hover:border-cyan-500/50 
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300 group backdrop-blur-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent"
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
      <div className="relative flex flex-col items-center gap-4">
        <LaughingMan size={80} className="text-cyan-500" />
        <div className="flex items-center gap-3 text-lg">
          <Power className="w-6 h-6 group-hover:text-cyan-300 transition-colors" />
          {jackingIn ? 'Establishing Neural Link...' : 'Jack In with Internet Identity'}
        </div>
      </div>
    </motion.button>
  );

  const StatusMetrics = [
    { icon: Brain, label: 'Neural Activity', value: '98%' },
    { icon: Cpu, label: 'Quantum Coherence', value: '87%' },
    { icon: Sparkles, label: 'Dimensional Sync', value: '92%' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <MatrixRain className="opacity-20" />
      
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <LaughingMan size={40} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Quantum Vault
            </h1>
          </div>
          {isAuthenticated && <ConnectionStatus />}
        </div>

        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div 
              key="jack-in"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[70vh] gap-8"
            >
              <JackInButton />
              <motion.div 
                className="text-cyan-500/60 text-sm max-w-md text-center bg-black/40 p-6 rounded-lg
                          border border-cyan-500/10 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="font-mono">[SYSTEM]:</span> Access to the Quantum Vault requires 
                neural synchronization via Internet Identity protocol. Establish secure connection 
                to interface with your Animas.
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="vault-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Interface Section */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Neural Interface */}
                  <div className="bg-black/40 p-6 rounded-lg border border-cyan-500/20 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-4">
                      <Network className="w-5 h-5 text-cyan-500" />
                      <h2 className="text-xl font-bold text-cyan-400">Neural Interface</h2>
                    </div>
                    <div className="h-64">
                      <NeuralInterface />
                    </div>
                  </div>
                  
                  {/* System Status */}
                  <div className="bg-black/40 p-6 rounded-lg border border-cyan-500/20 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-4">
                      <Binary className="w-5 h-5 text-cyan-500" />
                      <h2 className="text-xl font-bold text-cyan-400">System Status</h2>
                    </div>
                    <div className="space-y-4">
                      {StatusMetrics.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-cyan-500/70" />
                            <span className="text-sm text-cyan-500/70">{label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1 bg-black/40 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: value }}
                                className="h-full bg-cyan-500/40"
                                transition={{ duration: 1, delay: 0.5 }}
                              />
                            </div>
                            <span className="text-sm font-mono text-cyan-400">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activity Log */}
                <div className="space-y-6">
                  <div className="bg-black/40 p-6 rounded-lg border border-cyan-500/20 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-4">
                      <Terminal className="w-5 h-5 text-cyan-500" />
                      <h2 className="text-xl font-bold text-cyan-400">System Log</h2>
                    </div>
                    <div className="space-y-3">
                      {[
                        "Neural link established",
                        "Quantum state synchronized",
                        "Memory fragments analyzed",
                        "Dimensional scan complete"
                      ].map((activity, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                          <span className="text-cyan-500/70">{activity}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Laughing Man */}
        <motion.div
          className="fixed bottom-6 right-6 opacity-30 hover:opacity-100 transition-opacity"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <LaughingMan size={60} />
        </motion.div>
      </div>
    </div>
  );
};

export default QuantumVault;