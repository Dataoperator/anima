import { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { useWallet } from './useWallet';
import { useQuantum } from './useQuantum';
import { StakeInfo, PoolMetrics } from '@/types/staking';

export const useStaking = () => {
  const { wallet, animaActor } = useWallet();
  const { quantumState } = useQuantum();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stakeInfo, setStakeInfo] = useState<StakeInfo | null>(null);
  const [poolMetrics, setPoolMetrics] = useState<PoolMetrics | null>(null);

  useEffect(() => {
    if (wallet?.principal) {
      refreshStakeInfo();
      refreshPoolMetrics();
      
      // Set up periodic refresh
      const interval = setInterval(() => {
        refreshStakeInfo();
        refreshPoolMetrics();
      }, 60000); // Every minute
      
      return () => clearInterval(interval);
    }
  }, [wallet?.principal]);

  const refreshStakeInfo = async () => {
    if (!wallet?.principal || !animaActor) return;
    
    try {
      const info = await animaActor.get_stake_info(wallet.principal);
      if ('Ok' in info) {
        setStakeInfo(info.Ok);
      }
    } catch (err) {
      console.error('Failed to fetch stake info:', err);
    }
  };

  const refreshPoolMetrics = async () => {
    if (!animaActor) return;
    
    try {
      const metrics = await animaActor.get_pool_metrics();
      setPoolMetrics(metrics);
    } catch (err) {
      console.error('Failed to fetch pool metrics:', err);
    }
  };

  const stake = async (amount: bigint, lockDays: number) => {
    if (!wallet?.principal || !animaActor || !quantumState) {
      throw new Error('Wallet or quantum state not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const lockPeriod = BigInt(lockDays * 24 * 60 * 60 * 1_000_000_000); // Convert days to nanoseconds
      
      const result = await animaActor.stake(
        amount,
        lockPeriod,
        quantumState.coherence
      );

      if ('Err' in result) {
        throw new Error(result.Err);
      }

      await refreshStakeInfo();
      await refreshPoolMetrics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Staking failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const unstake = async () => {
    if (!wallet?.principal || !animaActor) {
      throw new Error('Wallet not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await animaActor.unstake();
      
      if ('Err' in result) {
        throw new Error(result.Err);
      }

      await refreshStakeInfo();
      await refreshPoolMetrics();
      
      return result.Ok;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unstaking failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const claimRewards = async () => {
    if (!wallet?.principal || !animaActor) {
      throw new Error('Wallet not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await animaActor.claim_rewards();
      
      if ('Err' in result) {
        throw new Error(result.Err);
      }

      await refreshStakeInfo();
      await refreshPoolMetrics();
      
      return result.Ok;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim rewards');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRewards = (
    amount: bigint,
    days: number,
    coherence: number
  ): bigint => {
    const baseAPR = 0.15; // 15% base APR
    const coherenceBonus = 1 + (coherence * 2); // Up to 3x bonus
    const periodBonus = 1 + (days / 365) * 0.5; // Up to 1.5x bonus for 1 year

    const effectiveAPR = baseAPR * coherenceBonus * periodBonus;
    const dailyRate = effectiveAPR / 365;
    const totalReturn = Number(amount) * (1 + (dailyRate * days));

    return BigInt(Math.floor(totalReturn - Number(amount)));
  };

  const getTimeRemaining = (): number | null => {
    if (!stakeInfo) return null;

    const unlockTime = Number(stakeInfo.start_time) + Number(stakeInfo.lock_period);
    const remaining = unlockTime - Date.now();
    return remaining > 0 ? remaining : 0;
  };

  const getStakingStats = () => {
    if (!stakeInfo || !poolMetrics) return null;

    return {
      effectiveAPR: calculateEffectiveAPR(
        Number(stakeInfo.lock_period) / (24 * 60 * 60 * 1_000_000_000), // Convert to days
        stakeInfo.quantum_coherence
      ),
      networkShare: Number(stakeInfo.amount) / Number(poolMetrics.total_staked),
      estimatedDaily: calculateRewards(
        stakeInfo.amount,
        1,
        stakeInfo.quantum_coherence
      ),
      coherenceRank: getCoherenceRank(stakeInfo.quantum_coherence)
    };
  };

  const calculateEffectiveAPR = (lockDays: number, coherence: number): number => {
    const baseAPR = 0.15;
    const coherenceBonus = 1 + (coherence * 2);
    const periodBonus = 1 + (lockDays / 365) * 0.5;
    return baseAPR * coherenceBonus * periodBonus;
  };

  const getCoherenceRank = (coherence: number): string => {
    if (coherence >= 0.9) return 'Legendary';
    if (coherence >= 0.8) return 'Epic';
    if (coherence >= 0.6) return 'Rare';
    if (coherence >= 0.4) return 'Uncommon';
    return 'Common';
  };

  return {
    stake,
    unstake,
    claimRewards,
    refreshStakeInfo,
    refreshPoolMetrics,
    calculateRewards,
    getTimeRemaining,
    getStakingStats,
    stakeInfo,
    poolMetrics,
    isLoading,
    error,
  };
};

export default useStaking;