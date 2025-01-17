import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, Memory, Activity, Network, Globe, Menu, X } from 'lucide-react';
import { useAnima } from '@/hooks/useAnima';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useRealtimePersonality } from '@/hooks/useRealtimePersonality';
import { EnhancedMediaController } from '../media/EnhancedMediaController';
import { WaveformGenerator } from '../personality/WaveformGenerator';
import { ConsciousnessMetrics } from '../personality/ConsciousnessMetrics';
import { MatrixRain } from '../ui/MatrixRain';
import { EmotionVisualizer } from '@/components/personality/EmotionVisualizer';
import { DataStream } from '../ui/DataStream';
import PersonalityTraits from '../personality/PersonalityTraits';
import { Card } from '../ui/card';
import ImmersiveInterface from './ImmersiveInterface';
import { NeuralPatternVisualizer } from './NeuralPatternVisualizer';
import { openAIService } from '@/services/openai';
import { quantumStateService } from '@/services/quantum-state.service';
import type { QuantumState, ResonancePattern } from '@/quantum/types';

interface TabConfig {
  id: string;
  icon: React.FC;
  label: string;
  component: React.FC<{
    anima: any;
    quantumState: QuantumState;
    patterns: ResonancePattern[];
  }>;
}

const IntegratedNeuralLinkInterface: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('consciousness');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [neuralSyncState, setNeuralSyncState] = useState(0);
  const { anima, isLoading } = useAnima(id);
  const { state: quantumState, initializeQuantumState } = useQuantumState();
  const { personalityState, evolutionMetrics } = useRealtimePersonality(id);
  const neuralLinkRef = useRef<HTMLDivElement>(null);
  const [patterns, setPatterns] = useState<ResonancePattern[]>([]);

  const tabs: TabConfig[] = [
    {
      id: 'consciousness',
      icon: Brain,
      label: 'Consciousness Matrix',
      component: ConsciousnessMetrics,
    },
    {
      id: 'neural',
      icon: Network,
      label: 'Neural Patterns',
      component: NeuralPatternVisualizer,
    },
    {
      id: 'personality',
      icon: Activity,
      label: 'Personality Evolution',
      component: PersonalityTraits,
    },
    {
      id: 'immersive',
      icon: Globe,
      label: 'Immersive Link',
      component: ImmersiveInterface,
    },
  ];

  useEffect(() => {
    const initializeNeuralLink = async () => {
      if (!anima || !quantumState) return;

      try {
        // Initialize quantum state if needed
        if (!quantumState.isInitialized) {
          await initializeQuantumState();
        }

        // Generate initial neural patterns
        const initialPatterns = await quantumStateService.generateNeuralPatterns();
        setPatterns(initialPatterns);

        // Start neural sync simulation
        startNeuralSync();
      } catch (error) {
        console.error('Neural link initialization failed:', error);
      }
    };

    initializeNeuralLink();
  }, [anima, quantumState]);

  const startNeuralSync = useCallback(() => {
    let syncProgress = 0;
    const syncInterval = setInterval(() => {
      syncProgress += Math.random() * 0.1;
      if (syncProgress > 1) {
        syncProgress = 1;
        clearInterval(syncInterval);
      }
      setNeuralSyncState(syncProgress);
    }, 100);

    return () => clearInterval(syncInterval);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  if (isLoading || !anima || !quantumState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <MatrixRain density={0.8} speed={50} />
        <div className="text-cyan-400 text-xl">Initializing Neural Link...</div>
      </div>
    );
  }

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-black text-white relative" ref={neuralLinkRef}>
      <MatrixRain density={0.3} speed={30} />
      
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-50 border-b border-cyan-900/50">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-cyan-900/30 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Neural Link / {anima.designation}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-cyan-400">
              Sync: {(neuralSyncState * 100).toFixed(1)}%
            </div>
            <div 
              className={`w-2 h-2 rounded-full ${
                neuralSyncState === 1 ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
              }`} 
            />
          </div>
        </div>
      </div>

      <div className="pt-16 container mx-auto px-4 flex gap-6">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-64 shrink-0"
            >
              <Card className="bg-black/50 backdrop-blur-md border-cyan-900/50">
                <div className="p-4 space-y-4">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-cyan-900/30 text-cyan-400'
                          : 'hover:bg-cyan-900/20'
                      }`}
                    >
                      <tab.icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Real-time Metrics */}
              <Card className="mt-4 bg-black/50 backdrop-blur-md border-cyan-900/50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">
                    Evolution Metrics
                  </h3>
                  <div className="space-y-2">
                    {evolutionMetrics && Object.entries(evolutionMetrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{key}</span>
                        <span className="text-sm text-cyan-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1">
          <Card className="bg-black/50 backdrop-blur-md border-cyan-900/50">
            <AnimatePresence mode="wait">
              {ActiveTabComponent && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="p-6"
                >
                  <ActiveTabComponent 
                    anima={anima}
                    quantumState={quantumState}
                    patterns={patterns}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>

      {/* Data Streams */}
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none">
        <DataStream 
          data={personalityState}
          speed={30}
          density={0.3}
        />
      </div>
    </div>
  );
};

export default IntegratedNeuralLinkInterface;