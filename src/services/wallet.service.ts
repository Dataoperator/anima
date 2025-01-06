import { Identity } from "@dfinity/agent";
import { quantumStateService } from "./quantum-state.service";

export interface WalletTransaction {
  id: string;
  amount: bigint;
  timestamp: bigint;
  quantum_signature?: string;
  status: 'pending' | 'completed' | 'failed';
  type: 'deposit' | 'mint' | 'transfer' | 'burn';
}

export interface WalletState {
  balance: bigint;
  transactions: WalletTransaction[];
  quantumCoherence: number;
  isLocked: boolean;
}

export class WalletService {
  private static instance: WalletService;
  private state: WalletState = {
    balance: BigInt(0),
    transactions: [],
    quantumCoherence: 1.0,
    isLocked: false
  };
  
  private readonly MINT_COST = BigInt(100_000_000); // 1 ICP in e8s

  private constructor() {}

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  async initialize(identity: Identity): Promise<void> {
    try {
      const isStable = await quantumStateService.checkStability(identity);
      if (!isStable) {
        throw new Error('Quantum state unstable - wallet initialization blocked');
      }

      const quantumField = await quantumStateService.initializeQuantumField(identity);
      this.state.quantumCoherence = quantumField.harmony;
      this.state.isLocked = false;

      await quantumStateService.generateNeuralPatterns(identity);
    } catch (error) {
      console.error('Wallet initialization failed:', error);
      this.state.isLocked = true;
      throw error;
    }
  }

  async verifyQuantumState(identity: Identity): Promise<boolean> {
    try {
      const metrics = quantumStateService.getQuantumMetrics();
      const isStable = await quantumStateService.checkStability(identity);

      this.state.quantumCoherence = metrics.coherenceLevel;
      this.state.isLocked = !isStable || metrics.coherenceLevel < 0.7;

      return isStable && metrics.coherenceLevel >= 0.7;
    } catch (error) {
      console.error('Quantum state verification failed:', error);
      this.state.isLocked = true;
      return false;
    }
  }

  async executeTransaction(
    identity: Identity,
    amount: bigint,
    type: 'deposit' | 'mint' | 'transfer' | 'burn'
  ): Promise<WalletTransaction> {
    const isValid = await this.verifyQuantumState(identity);
    if (!isValid) {
      throw new Error('Invalid quantum state - transaction blocked');
    }

    if (type === 'mint' && this.state.balance < this.MINT_COST) {
      throw new Error(`Insufficient balance. Minting requires ${Number(this.MINT_COST) / 100_000_000} ICP`);
    }

    const transaction: WalletTransaction = {
      id: `${type}_${Date.now()}`,
      amount,
      timestamp: BigInt(Date.now()),
      status: 'pending',
      type
    };

    try {
      const patterns = await quantumStateService.generateNeuralPatterns(identity);
      transaction.quantum_signature = `${patterns.resonance}-${patterns.awareness}-${patterns.understanding}`;

      switch (type) {
        case 'deposit':
          this.state.balance += amount;
          break;
        case 'mint':
          if (this.state.balance < amount) {
            throw new Error('Insufficient balance');
          }
          this.state.balance -= this.MINT_COST;
          break;
        case 'transfer':
          if (this.state.balance < amount) {
            throw new Error('Insufficient balance');
          }
          this.state.balance -= amount;
          break;
        case 'burn':
          if (this.state.balance < amount) {
            throw new Error('Insufficient balance');
          }
          this.state.balance -= amount;
          break;
      }

      transaction.status = 'completed';
      this.state.transactions.push(transaction);

      return transaction;
    } catch (error) {
      transaction.status = 'failed';
      this.state.transactions.push(transaction);
      throw error;
    }
  }

  getMintCost(): bigint {
    return this.MINT_COST;
  }

  getState(): WalletState {
    return { ...this.state };
  }

  isInitialized(): boolean {
    return !this.state.isLocked && this.state.quantumCoherence >= 0.7;
  }

  hasEnoughForMint(): boolean {
    return this.state.balance >= this.MINT_COST;
  }
}

export const walletService = WalletService.getInstance();