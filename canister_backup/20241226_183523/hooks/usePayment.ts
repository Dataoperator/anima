import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Principal } from '@dfinity/principal';
import type { Actor, PaymentResult, VariantMap } from '@/declarations/types/actor';

export enum PaymentType {
  Creation = 'Creation',
  Resurrection = 'Resurrection',
  GrowthPack = 'GrowthPack',
}

interface PaymentHookResult {
  isProcessing: boolean;
  error: string | null;
  initiatePayment: (type: PaymentType, tokenId?: bigint, packId?: bigint) => Promise<boolean>;
  completePayment: (block_height: bigint) => Promise<boolean>;
  paymentAmount: bigint | null;
}

const LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

interface TransferResult {
  Ok?: { block_height: bigint };
  Err?: string;
}

interface LedgerActor {
  transfer: (args: {
    to: Principal;
    fee: { e8s: bigint };
    memo: bigint;
    from_subaccount: never[];
    created_at_time: never[];
    amount: { e8s: bigint };
  }) => Promise<TransferResult>;
}

function formatError(error: any): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    if ('Configuration' in error) return error.Configuration;
    if ('PaymentFailed' in error) return 'Payment failed';
    if ('NotAuthorized' in error) return 'Not authorized';
    if ('NotFound' in error) return 'Not found';
    if ('External' in error) return error.External;
  }
  return 'Unknown error occurred';
}

export const usePayment = (): PaymentHookResult => {
  const { actor, identity } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<bigint | null>(null);

  const initiatePayment = async (
    type: PaymentType,
    tokenId?: bigint,
    packId?: bigint
  ): Promise<boolean> => {
    if (!actor) {
      setError('Actor not initialized');
      return false;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const paymentVariant: VariantMap = {
        [type]: packId ? { GrowthPack: packId } : null
      };

      const amount = await actor.initiate_payment(
        paymentVariant,
        tokenId ? [tokenId] : []
      );

      if ('Ok' in amount && amount.Ok) {
        setPaymentAmount(amount.Ok);
        
        if (!window.ic?.plug) {
          throw new Error('Internet Computer Plug wallet not found');
        }

        // Create ICP payment
        const ledgerActor = await window.ic.plug.createActor<LedgerActor>({
          canisterId: LEDGER_CANISTER_ID,
          interfaceFactory: ({ IDL }) => {
            return IDL.Service({
              transfer: IDL.Func(
                [
                  IDL.Record({
                    to: IDL.Principal,
                    fee: IDL.Record({ e8s: IDL.Nat64 }),
                    memo: IDL.Nat64,
                    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
                    created_at_time: IDL.Opt(
                      IDL.Record({ timestamp_nanos: IDL.Nat64 })
                    ),
                    amount: IDL.Record({ e8s: IDL.Nat64 }),
                  }),
                ],
                [IDL.Record({ block_height: IDL.Nat64 })],
                []
              ),
            });
          },
        });

        if (!identity) {
          throw new Error('Identity not found');
        }

        // Execute transfer
        const transferResult = await ledgerActor.transfer({
          to: identity.getPrincipal(),
          fee: { e8s: BigInt(10000) },
          memo: BigInt(0),
          from_subaccount: [],
          created_at_time: [],
          amount: { e8s: amount.Ok },
        });

        if ('Ok' in transferResult && transferResult.Ok) {
          return await completePayment(transferResult.Ok.block_height);
        } else if ('Err' in transferResult && transferResult.Err) {
          throw new Error(transferResult.Err);
        }
        throw new Error('Unknown transfer error');
      } else if ('Err' in amount) {
        throw new Error(formatError(amount.Err));
      }
      throw new Error('Unknown payment error');
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const completePayment = async (block_height: bigint): Promise<boolean> => {
    if (!actor) {
      setError('Actor not initialized');
      return false;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await actor.complete_payment(block_height);
      
      if ('Ok' in result) {
        setPaymentAmount(null);
        return true;
      } else if ('Err' in result) {
        throw new Error(formatError(result.Err));
      }
      throw new Error('Unknown completion error');
    } catch (err) {
      console.error('Payment completion failed:', err);
      setError(err instanceof Error ? err.message : 'Payment completion failed');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    error,
    initiatePayment,
    completePayment,
    paymentAmount,
  };
};

// Helper function to format ICP amounts
export const formatICP = (e8s: bigint): string => {
  const icp = Number(e8s) / 100_000_000;
  return `${icp.toFixed(2)} ICP`;
};