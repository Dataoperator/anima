import React from 'react';

export const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="relative">
        {/* Quantum field effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl animate-pulse" />
        
        {/* Loading content */}
        <div className="relative z-10 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin mx-auto" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">Initializing Quantum Interface</p>
            <p className="text-sm text-blue-400">Establishing neural connection...</p>
          </div>
        </div>
      </div>
    </div>
  );
};