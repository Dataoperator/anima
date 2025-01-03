import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useICPLedger } from '@/hooks/useICPLedger';
import { Principal } from '@dfinity/principal';
import { PaymentVerificationSystem, PaymentPurpose } from '@/services/payment-verification';
import { TransactionMonitor } from '@/services/transaction-monitor';
import { BalanceTracker } from '@/services/balance-tracker';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';

interface PaymentInfo {
  purpose: PaymentPurpose;
  amount: bigint;
  description: string;
}

const PAYMENT_TYPES: Record<PaymentPurpose, PaymentInfo> = {
  MINT: {
    purpose: 'MINT',
    amount: BigInt(10_000_000_000), // 10 ICP
    description: 'Mint new Living NFT'
  },
  GROWTH: {
    purpose: 'GROWTH',
    amount: BigInt(5_000_000_000), // 5 ICP
    description: 'Purchase Growth Pack'
  },
  RESURRECTION: {
    purpose: 'RESURRECTION',
    amount: BigInt(15_000_000_000), // 15 ICP
    description: 'Resurrect Anima'
  }
};

export const ICPPaymentPanel: React.FC = () => {
  const { identity } = useAuth();
  const { ledger, error: ledgerError, isInitializing } = useICPLedger();
  const [verificationSystem, setVerificationSystem] = useState<PaymentVerificationSystem>();
  const [currentPayment, setCurrentPayment] = useState<string>();
  const [balance, setBalance] = useState<bigint>();
  const [error, setError] = useState<string>();
  const errorTracker = ErrorTracker.getInstance();

  useEffect(() => {
    if (ledger && !verificationSystem) {
      const transactionMonitor = new TransactionMonitor(ledger);
      const balanceTracker = new BalanceTracker(ledger);
      setVerificationSystem(new PaymentVerificationSystem(ledger, transactionMonitor, balanceTracker));
    }
  }, [ledger]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (ledger && identity) {
        try {
          const userBalance = await ledger.getBalance(await identity.getPrincipal());
          setBalance(userBalance);
        } catch (err) {
          console.error('Failed to fetch balance:', err);
        }
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [ledger, identity]);

  const initiatePayment = async (paymentType: PaymentPurpose) => {
    if (!ledger || !identity || !verificationSystem) {
      setError('Payment system not ready');
      return;
    }

    try {
      const paymentInfo = PAYMENT_TYPES[paymentType];
      const payer = await identity.getPrincipal();
      const treasury = Principal.fromText(process.env.NEXT_PUBLIC_TREASURY_ID || 'aaaaa-aa');

      const verification = await verificationSystem.initiateVerification({
        purpose: paymentType,
        amount: paymentInfo.amount,
        payer,
        recipient: treasury
      });

      setCurrentPayment(verification.transactionId);

      // Monitor verification status
      const checkStatus = setInterval(async () => {
        const isVerified = await verificationSystem.verifyPayment(verification.transactionId);
        if (isVerified) {
          clearInterval(checkStatus);
          // Handle successful payment
          handlePaymentSuccess(paymentType);
        }
      }, 5000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkStatus);
        if (currentPayment === verification.transactionId) {
          setError('Payment verification timed out');
        }
      }, 300000);

    } catch (error) {
      errorTracker.trackError(
        ErrorCategory.PAYMENT,
        error instanceof Error ? error : new Error('Payment initiation failed'),
        ErrorSeverity.HIGH,
        { paymentType }
      );
      setError(error instanceof Error ? error.message : 'Payment initiation failed');
    }
  };

  const handlePaymentSuccess = async (paymentType: PaymentPurpose) => {
    // Handle different payment types
    switch (paymentType) {
      case 'MINT':
        // Trigger mint process
        break;
      case 'GROWTH':
        // Apply growth pack
        break;
      case 'RESURRECTION':
        // Trigger resurrection
        break;
    }
  };

  if (isInitializing) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (ledgerError || error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Payment Error</h3>
        <p className="text-red-600 mt-2">{ledgerError || error}</p>
        <button
          onClick={() => setError(undefined)}
          className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900">Your Balance</h3>
        <p className="text-2xl font-bold text-gray-900">
          {balance ? `${Number(balance) / 100_000_000} ICP` : 'Loading...'}
        </p>
      </div>

      {/* Payment Options */}
      <div className="space-y-4">
        {Object.entries(PAYMENT_TYPES).map(([key, info]) => (
          <button
            key={key}
            onClick={() => initiatePayment(info.purpose)}
            disabled={currentPayment !== undefined}
            className={`w-full px-4 py-3 rounded-lg transition-all transform hover:scale-[1.02] ${
              currentPayment
                ? 'bg-gray-100 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{info.description}</span>
              <span>{Number(info.amount) / 100_000_000} ICP</span>
            </div>
          </button>
        ))}
      </div>

      {/* Current Payment Status */}
      {currentPayment && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900">Payment in Progress</h4>
          <p className="mt-2 text-blue-800">
            Please complete the payment in your wallet...
          </p>
          <div className="mt-4">
            <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};