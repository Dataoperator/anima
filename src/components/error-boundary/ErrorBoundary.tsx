import React, { Component, ErrorInfo, ReactNode } from 'react';
import { MatrixRain } from '../ui/MatrixRain';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="relative min-h-screen bg-black">
          <MatrixRain className="absolute inset-0" />
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center p-8 max-w-md bg-black/80 rounded-lg backdrop-blur-lg">
              <h1 className="text-2xl font-bold mb-4 text-red-500">
                Neural Link Disrupted
              </h1>
              <p className="text-gray-300 mb-4">
                {this.state.error?.message || 'An unexpected error occurred in the quantum field.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Reinitialize Connection
              </button>
              <div className="mt-4 p-4 bg-gray-900 rounded text-left">
                <p className="text-xs text-gray-500 font-mono">
                  Error Code: {this.state.error?.name || 'UNKNOWN'}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}