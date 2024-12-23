import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthProvider';
import EnhancedChat from './EnhancedChat';
import PersonalityTraits from './PersonalityTraits';

const ImmersiveAnimaUI = ({ principalId, animaName }) => {
  const { actor } = useAuth();
  const [personality, setPersonality] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPersonality = async () => {
      try {
        const result = await actor.get_anima(principalId);
        if ('Ok' in result) {
          setPersonality(result.Ok.personality);
        }
      } catch (error) {
        console.error('Failed to fetch personality:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonality();
  }, [actor, principalId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EnhancedChat principalId={principalId} />
          </div>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-2">{animaName}</h2>
                <p className="text-gray-600">
                  Level {personality?.growth_level || 1}
                </p>
              </div>

              {personality && (
                <PersonalityTraits traits={personality.traits} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveAnimaUI;