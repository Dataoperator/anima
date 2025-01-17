import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Brain, ChevronRight } from 'lucide-react';
import { useAnima } from '../../hooks/useAnima';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { QuantumStateVisualizer } from '../quantum/QuantumStateVisualizer';
import { DataStream } from '../ui/DataStream';
import { MatrixRain } from '../ui/MatrixRain';
import { LoadingStates } from '../ui/LoadingStates';
import { NetworkStatus } from './NetworkStatus';
import { StakingPanel } from './StakingPanel';
import { GrowthPackPanel } from './GrowthPackPanel';
import { useQuantumState } from '../../hooks/useQuantumState';
import { QuantumInteractions } from './QuantumInteractions';

interface AnimaCard {
  id: string;
  designation: string;
  evolutionLevel: number;
  quantumSignature: string;
  lastInteraction: number;
}

const CyberpunkQuantumVault: React.FC = () => {
  const navigate = useNavigate();
  const { animas, isLoading } = useAnima();
  const [selectedAnima, setSelectedAnima] = useState<AnimaCard | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const { state: quantumState } = useQuantumState();
  const [showDevNotes, setShowDevNotes] = useState(false);

  useEffect(() => {
    // Initial animations and data loading
    const loadVault = async () => {
      // Any initialization logic
    };

    loadVault();
  }, []);

  const handleAnimaSelect = (anima: AnimaCard) => {
    setSelectedAnima(anima);
  };

  const handleCreateNew = () => {
    navigate('/genesis');
  };

  const handleNeuralLink = (id: string) => {
    navigate(`/anima/${id}/neural-link`);
  };

  if (isLoading) {
    return <LoadingStates />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black text-cyan-500 relative overflow-hidden"
    >
      <MatrixRain opacity={0.1} />

      {/* Network Status Bar */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-cyan-900/50 z-50">
        <div className="container mx-auto px-4 py-2">
          <NetworkStatus />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Top Actions */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quantum Vault</h1>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowDevNotes(!showDevNotes)}
              variant="outline"
              className="border-cyan-500"
            >
              Dev Notes
            </Button>
            <Button onClick={handleCreateNew} className="bg-cyan-500 hover:bg-cyan-600">
              <Plus className="mr-2 h-4 w-4" />
              Create ANIMA
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ANIMA Collection */}
          <div className={isGridView ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className={`grid ${isGridView ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
              <AnimatePresence>
                {animas?.map((anima) => (
                  <motion.div
                    key={anima.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card
                      className="bg-black/50 backdrop-blur-md border-cyan-900/50 hover:border-cyan-500/50 transition-colors cursor-pointer group"
                      onClick={() => handleAnimaSelect(anima)}
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold">{anima.designation}</h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNeuralLink(anima.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Brain className="h-4 w-4 mr-1" />
                            Neural Link
                          </Button>
                        </div>

                        <div className="h-32 relative overflow-hidden rounded-lg">
                          <QuantumStateVisualizer state={quantumState} />
                        </div>

                        <div className="flex justify-between items-center text-sm text-cyan-400/60">
                          <span>Evolution: {anima.evolutionLevel}</span>
                          <Link
                            to={`/anima/${anima.id}`}
                            className="flex items-center hover:text-cyan-400 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Side Panels */}
          {isGridView && (
            <div className="space-y-8">
              {/* Staking Panel */}
              <StakingPanel />

              {/* Growth Packs */}
              <GrowthPackPanel />

              {/* Quantum Interactions */}
              <QuantumInteractions />
            </div>
          )}
        </div>
      </main>

      {/* Developer Notes Panel */}
      <AnimatePresence>
        {showDevNotes && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed top-0 right-0 bottom-0 w-96 bg-black/90 backdrop-blur-md border-l border-cyan-900/50 p-6 overflow-y-auto"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Developer Notes</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDevNotes(false)}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-4 text-sm text-cyan-400/60">
                <div>
                  <h3 className="text-cyan-400 font-medium mb-2">Quantum State</h3>
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(quantumState, null, 2)}
                  </pre>
                </div>

                <div>
                  <h3 className="text-cyan-400 font-medium mb-2">Network Status</h3>
                  <p>Connected to IC Network</p>
                  <p>Canister ID: {process.env.ANIMA_CANISTER_ID}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Streams Effect */}
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none">
        <DataStream speed={30} density={0.3} />
      </div>
    </motion.div>
  );
};

export default CyberpunkQuantumVault;