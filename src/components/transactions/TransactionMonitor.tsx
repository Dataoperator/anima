import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, AlertTriangle, RotateCw } from 'lucide-react';
import { usePayment } from '@/contexts/payment-context';
import { Card } from '@/components/ui/card';
import { transactionMonitorService } from '@/services/transaction-monitor';

interface TransactionMonitorProps {
  transactionHash: string;
}

type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'recovery';

interface TransactionState {
  status: TransactionStatus;
  confirmations: number;
  error?: string;
  recoveryAttempts?: number;
}

export const TransactionMonitor: React.FC<TransactionMonitorProps> = ({ 
  transactionHash 
}) => {
  const { refreshBalance } = usePayment();
  const [state, setState] = useState<TransactionState>({
    status: 'pending',
    confirmations: 0
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const monitorTransaction = async () => {
      try {
        unsubscribe = transactionMonitorService.monitorTransaction(
          transactionHash,
          {
            onStatusChange: (newStatus, details) => {
              setState(prev => ({
                ...prev,
                status: newStatus as TransactionStatus,
                ...(details || {})
              }));

              if (newStatus === 'confirmed') {
                refreshBalance();
              }
            },
            onConfirmation: (count) => {
              setState(prev => ({
                ...prev,
                confirmations: count
              }));
            },
            onError: (error) => {
              setState(prev => ({
                ...prev,
                status: 'failed',
                error: error.message
              }));
            },
            onRecoveryAttempt: (attempt) => {
              setState(prev => ({
                ...prev,
                status: 'recovery',
                recoveryAttempts: attempt
              }));
            }
          }
        );
      } catch (error) {
        console.error('Failed to start transaction monitoring:', error);
      }
    };

    monitorTransaction();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [transactionHash, refreshBalance]);

  const getStatusColor = (status: TransactionStatus): string => {
    switch (status) {
      case 'confirmed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'recovery': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="text-green-400" />;
      case 'failed':
        return <AlertTriangle className="text-red-400" />;
      case 'recovery':
        return <RotateCw className="text-yellow-400 animate-spin" />;
      default:
        return <Activity className="text-blue-400" />;
    }
  };

  return (
    <Card className="bg-black/60 backdrop-blur-lg border-cyan-900/50 p-6">
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          animate={{ 
            scale: state.status === 'pending' ? [1, 1.1, 1] : 1 
          }}
          transition={{ 
            repeat: state.status === 'pending' ? Infinity : 0,
            duration: 1 
          }}
        >
          {getStatusIcon(state.status)}
        </motion.div>
        
        <div>
          <h3 className={`font-medium ${getStatusColor(state.status)}`}>
            Transaction {state.status.charAt(0).toUpperCase() + state.status.slice(1)}
          </h3>
          <p className="text-sm text-gray-400">
            Hash: {transactionHash}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {state.confirmations > 0 && (
          <div className="text-sm text-gray-400">
            Confirmations: {state.confirmations}
          </div>
        )}

        {state.recoveryAttempts !== undefined && (
          <div className="text-sm text-yellow-400">
            Recovery Attempt: {state.recoveryAttempts}
          </div>
        )}

        {state.error && (
          <div className="text-sm text-red-400">
            Error: {state.error}
          </div>
        )}

        {state.status === 'pending' && (
          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-blue-500"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{ width: '50%' }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};