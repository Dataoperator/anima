import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MediaPlayer } from './MediaPlayer';
import { MediaActionSystem, MediaState, MediaAction } from '@/autonomous/MediaActions';
import { useAnima } from '@/hooks/useAnima';

interface AnimaMediaInterfaceProps {
  onMediaStateChange?: (state: MediaState) => void;
  onAnimaAction?: (action: MediaAction) => void;
}

export const AnimaMediaInterface: React.FC<AnimaMediaInterfaceProps> = ({
  onMediaStateChange,
  onAnimaAction
}) => {
  const [mediaSystem] = useState(() => new MediaActionSystem());
  const [currentState, setCurrentState] = useState<MediaState>({
    currentUrl: null,
    isPlaying: false,
    volume: 0.75,
    timestamp: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const { activeAnima } = useAnima();

  // Handle media actions from the anima
  const handleAnimaAction = async (action: MediaAction) => {
    try {
      if (action.type === 'search') {
        const results = await mediaSystem.searchMedia(action.payload.query!, action.source);
        if (results.length > 0) {
          const newState = mediaSystem.processAction({
            type: 'play',
            source: action.source,
            payload: { url: results[0] }
          });
          setCurrentState(newState);
          onMediaStateChange?.(newState);
        }
      } else {
        const newState = mediaSystem.processAction(action);
        setCurrentState(newState);
        onMediaStateChange?.(newState);
      }

      onAnimaAction?.(action);
    } catch (error) {
      console.error('Failed to process anima media action:', error);
    }
  };

  const handleStateChange = (state: MediaState) => {
    setCurrentState(state);
    onMediaStateChange?.(state);
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-black/20 backdrop-blur-lg rounded-xl overflow-hidden"
      animate={{
        width: isExpanded ? 480 : 320,
        height: isExpanded ? 360 : 240
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Resize Handle */}
      <button
        className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <svg 
          className="w-4 h-4 text-white" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
        >
          {isExpanded ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          )}
        </svg>
      </button>

      {/* Media Player */}
      {currentState.currentUrl && (
        <MediaPlayer
          url={currentState.currentUrl}
          onStateChange={handleStateChange}
          size={{
            width: isExpanded ? 480 : 320,
            height: isExpanded ? 270 : 180
          }}
          controls={{
            canPlay: true,
            canPause: true,
            canSeek: true,
            canAdjustVolume: true
          }}
        />
      )}

      {/* Media Info */}
      <div className="p-4 text-white/90">
        <p className="text-sm font-medium">
          {activeAnima?.name}'s Media Space
        </p>
        <p className="text-xs text-white/60">
          {currentState.isPlaying ? 'Now Playing' : 'Ready to Play'}
        </p>
      </div>
    </motion.div>
  );
};