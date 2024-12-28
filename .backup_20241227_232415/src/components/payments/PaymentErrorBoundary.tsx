import React, { Component, ErrorInfo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export class PaymentErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    retryCount: 0,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Payment error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prev => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 rounded-lg border border-red-500/20"
        >
          <h3 className="text-lg font-medium text-red-400 mb-2">
            Payment Error
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          {this.state.retryCount < 3 && (
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
            >
              Retry Payment
            </button>
          )}
          {this.state.retryCount >= 3 && (
            <div className="text-sm text-red-400">
              Too many retry attempts. Please try again later or contact support.
            </div>
          )}
        </motion.div>
      );
    }

    return this.props.children;
  }
}