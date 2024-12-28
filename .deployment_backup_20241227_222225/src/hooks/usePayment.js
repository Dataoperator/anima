import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Principal } from '@dfinity/principal';

export const PaymentType = {
  Creation: 'Creation',
  Resurrection: 'Resurrection',
  GrowthPack: 'GrowthPack'
};

const E8S_PER_ICP = BigInt(100_000_000);

export const formatICP = (amount) => {
  if (typeof amount === 'bigint') {
    return `${Number(amount) / Number(E8S_PER_ICP)} ICP`;
  }
  return `${amount} ICP`;
};

const PAYMENT_AMOUNTS = {
  [PaymentType.Creation]: BigInt(Math.floor(0.1 * Number(E8S_PER_ICP))),
  [PaymentType.Resurrection]: BigInt(Math.floor(0.05 * Number(E8S_PER_ICP))),
  [PaymentType.GrowthPack]: BigInt(Math.floor(0.02 * Number(E8S_PER_ICP)))
};

export const usePayment = () => {
  const { actor } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const getPaymentAmount = useCallback((type, packId) => {
    if (type === PaymentType.GrowthPack && packId) {
      // Growth packs can have different prices based on their ID
      return PAYMENT_AMOUNTS[type] * (BigInt(packId) + BigInt(1));
    }
    return PAYMENT_AMOUNTS[type];
  }, []);

  const initiatePayment = useCallback(async (type, tokenId = null, packId = null) => {
    setError(null);
    setIsProcessing(true);

    try {
      const amount = getPaymentAmount(type, packId);
      let initResult;

      if (type === PaymentType.GrowthPack) {
        initResult = await actor.initiate_payment({ GrowthPack: packId }, [tokenId]);
      } else {
        initResult = await actor.initiate_payment({ [type]: null }, tokenId ? [tokenId] : []);
      }

      if ('Ok' in initResult) {
        const blockHeight = initResult.Ok;
        const completeResult = await actor.complete_payment(blockHeight);

        if ('Ok' in completeResult) {
          return true;
        } else {
          throw new Error('Payment completion failed');
        }
      } else {
        throw new Error('Payment initialization failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [actor, getPaymentAmount]);

  const verifyPayment = useCallback(async (blockHeight) => {
    try {
      const result = await actor.verify_payment(blockHeight);
      return 'Ok' in result;
    } catch (err) {
      console.error('Payment verification error:', err);
      return false;
    }
  }, [actor]);

  return {
    initiatePayment,
    verifyPayment,
    getPaymentAmount,
    isProcessing,
    error
  };
};