import React, { useCallback, useEffect, useState } from 'react';
import { useAnima } from '../../contexts/anima-context';
import { QuantumState } from '@/types/quantum';

interface MediaControllerProps {
  url: string | null;
  onMediaSelect: (url: string) => void;
  quantumState: QuantumState;
}

export const MediaController: React.FC<MediaControllerProps> = ({
  url,
  onMediaSelect,
  quantumState
}) => {
  const { anima } = useAnima();
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (anima && quantumState) {
      const fetchRecommendations = async () => {
        // Update recommendations based on quantum state and consciousness
        const newRecommendations = await anima.generateMediaRecommendations(quantumState);
        setRecommendations(newRecommendations);
      };
      fetchRecommendations();
    }
  }, [anima, quantumState]);

  const handleMediaSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('mediaUrl') as HTMLInputElement;
    if (input.value) {
      onMediaSelect(input.value);
      input.value = '';
    }
  }, [onMediaSelect]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow bg-black rounded-lg overflow-hidden relative">
        {url ? (
          <iframe
            src={url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No media selected</p>
          </div>
        )}
      </div>

      <form onSubmit={handleMediaSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            name="mediaUrl"
            placeholder="Enter media URL..."
            className="flex-grow px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
          >
            Load
          </button>
        </div>
      </form>

      {recommendations.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Recommended Media</h3>
          <div className="grid grid-cols-2 gap-2">
            {recommendations.map((rec, index) => (
              <button
                key={index}
                onClick={() => onMediaSelect(rec)}
                className="p-2 text-left bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors truncate"
              >
                {rec}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaController;