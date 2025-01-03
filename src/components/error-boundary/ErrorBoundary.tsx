import React, { Component, ErrorInfo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorDetailsProps {
  error: Error;
  errorInfo: ErrorInfo;
  onReset: () => void;
}

const ErrorDetails: React.FC<ErrorDetailsProps> = ({ error, errorInfo, onReset }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="min-h-screen bg-black text-white flex items-center justify-center p-4"
  >
    <div className="max-w-2xl w-full">
      <div className="bg-gray-900 rounded-lg p-6 shadow-xl border border-red-500/20">
        <h1 className="text-2xl font-bold text-red-400 mb-4">
          Quantum Stability Error Detected
        </h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Error Message:</h2>
          <pre className="bg-black rounded p-4 overflow-x-auto">
            {error.message}
          </pre>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Stack Trace:</h2>
          <pre className="bg-black rounded p-4 overflow-x-auto text-sm">
            {errorInfo.componentStack}
          </pre>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Reset Quantum State
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
          >
            Reinitialize System
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <p className="mt-4 text-sm text-gray-400">
            This error has been logged to the development console.
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Quantum Error:', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      location: window.location.href
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError && this.state.error && this.state.errorInfo) {
      return (
        <ErrorDetails
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

// Export a hook for programmatic error handling
export const useErrorHandler = () => {
  const handleError = (error: Error) => {
    console.error('Handled Error:', error);
    throw error;
  };

  return { handleError };
};