import React from 'react';
import { Volume2, VolumeX, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';

interface VideoControlsProps {
  volume: number;
  isMuted: boolean;
  isMinimized: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleSize: () => void;
  onOpenExternal: () => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  volume,
  isMuted,
  isMinimized,
  onVolumeChange,
  onToggleMute,
  onToggleSize,
  onOpenExternal
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={onToggleMute}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-white/80" />
            ) : (
              <Volume2 className="w-4 h-4 text-white/80" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
            className="w-20 accent-purple-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenExternal}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 text-white/80" />
          </button>

          <button
            onClick={onToggleSize}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white/80" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white/80" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};