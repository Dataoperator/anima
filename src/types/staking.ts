export interface StakeInfo {
  amount: bigint;
  start_time: bigint;
  quantum_coherence: number;
  lock_period: bigint;
  accumulated_rewards: bigint;
  last_reward_calculation: bigint;
}

export interface PoolMetrics {
  total_staked: bigint;
  total_rewards_distributed: bigint;
  number_of_stakers: bigint;
  average_coherence: number;
  network_stability: number;
}

export interface StakingStats {
  effectiveAPR: number;
  networkShare: number;
  estimatedDaily: bigint;
  coherenceRank: string;
}

export type StakeResult = {
  Ok: null;
} | {
  Err: string;
};

export type UnstakeResult = {
  Ok: bigint;
} | {
  Err: string;
};

export type ClaimRewardsResult = {
  Ok: bigint;
} | {
  Err: string;
};