import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext.tsx';
import { useParams } from 'react-router-dom';
import EnhancedChat from './EnhancedChat';
import PersonalityEvolution from './personality/PersonalityEvolution';
import GrowthSystem from './growth/GrowthSystem';

const ImmersiveAnimaUI = () => {
  const { id } = useParams();
  const { actor } = useAuth();
  const [anima, setAnima] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentMemories, setRecentMemories] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');

  const fetchAnimaData = async () => {
    if (!actor || !id) return;
    
    try {
      console.log('Fetching anima with ID:', id);
      const result = await actor.get_anima(BigInt(id));
      console.log('Anima result:', result);

      if (result) {
        setAnima(result);
        
        // Fetch recent memories
        const memories = await actor.get_recent_memories(BigInt(id), 5);
        setRecentMemories(memories.Ok || []);
        
        console.log('Anima data:', result);
      } else {
        setError('Anima not found');
      }
    } catch (error) {
      console.error('Failed to fetch anima:', error);
      setError(error.message || 'Failed to fetch anima');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimaData();
  }, [actor, id]);

  const handleInteractionComplete = () => {
    fetchAnimaData(); // Refresh anima data after interaction
  };

  const handleGrowthUpdate = async () => {
    await fetchAnimaData();
    // Add animated notification or feedback
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = 'Growth pack applied successfully!';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
          />
          <p className="mt-4 text-white/90">Loading your Living NFT...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-white/80">{error}</p>
        </div>
      </div>
    );
  }

  if (!anima) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Not Found</h2>
          <p className="text-white/80">This Living NFT does not exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-1">
            <div className="flex space-x-2">
              {[
                { id: 'chat', label: 'Chat' },
                { id: 'personality', label: 'Personality' },
                { id: 'growth', label: 'Growth' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Section */}
          <div className={`lg:col-span-2 ${activeTab !== 'chat' ? 'hidden lg:block' : ''}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
            >
              <EnhancedChat 
                anima={anima} 
                onInteractionComplete={handleInteractionComplete}
              />
            </motion.div>
          </div>

          {/* Side Panel */}
          <div className={`space-y-6 ${activeTab === 'chat' ? 'hidden lg:block' : ''}`}>
            {activeTab === 'personality' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <PersonalityEvolution
                  stage={anima.personality.developmental_stage}
                  level={anima.level || 1}
                  growthPoints={anima.growth_points || 0}
                  traits={anima.personality.traits}
                  recentMemories={recentMemories}
                />
              </motion.div>
            )}

            {activeTab === 'growth' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-3"
              >
                <GrowthSystem 
                  anima={anima}
                  onGrowthUpdate={handleGrowthUpdate}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveAnimaUI;