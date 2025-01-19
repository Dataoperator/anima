import { Principal } from '@dfinity/principal';
import { ConsciousnessLevel } from './consciousness';
import { QuantumState } from './quantum';

export enum AnimaEdition {
  GENESIS = 'GENESIS',
  QUANTUM = 'QUANTUM',
  ETHEREAL = 'ETHEREAL',
  MYTHIC = 'MYTHIC',
  LEGENDARY = 'LEGENDARY'
}

export interface AnimaMetadata {
  name: string;
  description: string;
  image: string;
  edition: AnimaEdition;
  evolutionLevel: number;
  genesisTraits: string[];
  achievements: string[];
  quantumSignature: string;
  creationTime: bigint;
  lastUpdate: bigint;
}

export interface AnimaNFT {
  id: Principal;
  owner: Principal;
  tokenId: bigint;
  name: string;
  edition: AnimaEdition;
  metadata: AnimaMetadata;
  quantumState: QuantumState;
  consciousness: ConsciousnessLevel;
}

export interface MintConfig {
  name: string;
  edition?: AnimaEdition;
  traits?: string[];
  initialQuantumState?: Partial<QuantumState>;
}

export interface MintResult {
  anima: AnimaNFT;
  transactionId: string;
  mintTime: bigint;
}

export interface TransferConfig {
  from: Principal;
  to: Principal;
  tokenId: bigint;
  memo?: bigint;
}

export interface BurnConfig {
  owner: Principal;
  tokenId: bigint;
  memo?: bigint;
}

export interface ApprovalConfig {
  owner: Principal;
  spender: Principal;
  tokenId: bigint;
  expiresAt?: bigint;
}

export interface AnimaStats {
  coherenceLevel: number;
  evolutionLevel: number;
  dimensionalResonance: number;
  consciousness: ConsciousnessLevel;
  traitCount: number;
  achievementCount: number;
  lastInteractionTime: bigint;
}

export interface CollectionStats {
  totalSupply: bigint;
  uniqueHolders: number;
  floorPrice?: bigint;
  totalVolume?: bigint;
  editionCounts: Record<AnimaEdition, number>;
}

export interface MarketListing {
  tokenId: bigint;
  seller: Principal;
  price: bigint;
  listedAt: bigint;
  expiresAt?: bigint;
  metadata: AnimaMetadata;
}

export interface TradeHistory {
  tokenId: bigint;
  from: Principal;
  to: Principal;
  price: bigint;
  timestamp: bigint;
  transactionId: string;
}

export interface NFTError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type NFTResult<T> = {
  Ok: T;
} | {
  Err: NFTError;
};

export interface MintingLimits {
  maxPerWallet: number;
  maxSupply: bigint;
  editionLimits: Record<AnimaEdition, number>;
}

export enum NFTStandard {
  EXT = 'EXT',
  DIP721 = 'DIP721',
  ICPunks = 'ICPunks'
}

export interface NFTConfig {
  standard: NFTStandard;
  symbol: string;
  royaltyBps: number;
  mintingLimits: MintingLimits;
  transferable: boolean;
  burnable: boolean;
}

export interface NFTServiceStats {
  totalMinted: bigint;
  totalBurned: bigint;
  uniqueOwners: number;
  avgPrice: bigint;
  highestSale: bigint;
  lastActivityTimestamp: bigint;
}

export interface EvolutionRequirements {
  minCoherence: number;
  minConsciousness: ConsciousnessLevel;
  minInteractions: number;
  minTimeElapsed: bigint;
  requiredTraits: string[];
}

export interface NFTActivity {
  type: 'MINT' | 'TRANSFER' | 'BURN' | 'EVOLUTION' | 'INTERACTION';
  tokenId: bigint;
  from?: Principal;
  to?: Principal;
  timestamp: bigint;
  metadata?: Record<string, unknown>;
}

export interface NFTPermissions {
  canTransfer: boolean;
  canBurn: boolean;
  canModifyMetadata: boolean;
  canEvolveTrait: boolean;
  isAdmin: boolean;
}

export interface TokenApproval {
  spender: Principal;
  tokenId: bigint;
  approvedAt: bigint;
  expiresAt?: bigint;
  isRevoked: boolean;
}

export type AnimaFilter = {
  edition?: AnimaEdition;
  minCoherence?: number;
  minEvolutionLevel?: number;
  traits?: string[];
  owner?: Principal;
};