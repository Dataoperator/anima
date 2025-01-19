import { Identity, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "./declarations/anima";
import { idlFactory as ledgerIDL } from "./declarations/ledger/ledger.did.js";
import { _SERVICE as AnimaService } from './declarations/anima/anima.did';
import { _SERVICE as LedgerService } from './declarations/ledger/ledger.did.d';
import { ErrorTracker } from './error/quantum_error';
import { Principal } from '@dfinity/principal';
import { Actor, ActorSubclass } from '@dfinity/agent';
import { QuantumStateManager } from './quantum/StateManager';

const CANISTER_ID = {
  anima: process.env.CANISTER_ID_ANIMA?.toString() || 'l2ilz-iqaaa-aaaaj-qngjq-cai',
  assets: process.env.CANISTER_ID_ANIMA_ASSETS?.toString() || 'lpp2u-jyaaa-aaaaj-qngka-cai',
  ledger: 'ryjl3-tyaaa-aaaaa-aaaba-cai' // ICP Ledger canister ID
};

const HOST = 'https://icp0.io';

type StageChangeCallback = (stage: string) => void;
type SystemStatus = 'initializing' | 'ready' | 'error' | 'quantum_ready';

export async function createICPLedgerActor(identity: Identity): Promise<ActorSubclass<LedgerService>> {
  const agent = new HttpAgent({
    identity,
    host: HOST
  });

  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey().catch(console.error);
  }

  return Actor.createActor(ledgerIDL, {
    agent,
    canisterId: Principal.fromText(CANISTER_ID.ledger)
  });
}

class ICManager {
  private static instance: ICManager;
  private actor: AnimaService | null = null;
  private agent: HttpAgent | null = null;
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;
  private initialized = false;
  private initializing = false;
  private quantumInitialized = false;
  private stageChangeCallbacks: StageChangeCallback[] = [];
  private errorTracker: ErrorTracker;
  private quantumStateManager: QuantumStateManager;
  private systemStatus: SystemStatus = 'initializing';

  private constructor() {
    this.errorTracker = ErrorTracker.getInstance();
    this.quantumStateManager = QuantumStateManager.getInstance();
    
    if (typeof window !== 'undefined') {
      window.ic = {
        ...(window.ic || {}),
        agent: null,
        HttpAgent,
      };
    }
  }

  static getInstance(): ICManager {
    if (!ICManager.instance) {
      ICManager.instance = new ICManager();
    }
    return ICManager.instance;
  }

  onStageChange(callback: StageChangeCallback) {
    this.stageChangeCallbacks.push(callback);
  }

  private updateStage(stage: string) {
    console.log('IC Stage:', stage);
    this.stageChangeCallbacks.forEach(callback => callback(stage));
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('IC already initialized');
      return;
    }

    if (this.initializing) {
      console.log('IC initialization already in progress');
      return;
    }

    try {
      this.initializing = true;
      this.systemStatus = 'initializing';
      console.log('Starting IC initialization...');

      this.updateStage('Creating AuthClient...');
      if (!this.authClient) {
        this.authClient = await AuthClient.create({
          idleOptions: { disableIdle: true }
        });
      }
      
      this.updateStage('Getting identity...');
      this.identity = this.authClient.getIdentity();
      if (!this.identity) {
        throw new Error('Failed to get identity');
      }

      const principal = this.identity.getPrincipal();
      console.log('Identity principal:', principal.toText());

      this.updateStage('Creating HttpAgent...');
      this.agent = new HttpAgent({
        identity: this.identity,
        host: HOST
      });

      if (process.env.NODE_ENV !== 'production') {
        this.updateStage('Fetching root key...');
        await this.agent.fetchRootKey().catch(console.error);
      }

      const canisterId = CANISTER_ID.anima?.replace(/['"]/g, '');
      if (!canisterId) {
        throw new Error('Invalid canister ID');
      }

      this.updateStage('Creating Actor...');
      this.actor = await createActor(canisterId, {
        agent: this.agent
      }) as AnimaService;

      // Verify the actor
      if (!this.actor || typeof this.actor.initialize_genesis !== 'function') {
        throw new Error('Actor creation failed or missing required methods');
      }

      this.updateStage('Setting up window.ic...');
      window.ic = {
        ...(window.ic || {}),
        agent: this.agent,
        HttpAgent
      };

      if (this.actor) {
        window.canister = this.actor;
      }
      
      this.initialized = true;
      this.initializing = false;

      // Initialize quantum systems
      await this.initializeQuantumSystems();
      
      this.systemStatus = 'ready';
      this.updateStage('Initialization complete!');

    } catch (error) {
      this.initializing = false;
      this.systemStatus = 'error';
      await this.errorTracker.trackError({
        errorType: 'IC_INIT_ERROR',
        severity: 'HIGH',
        context: 'IC Initialization',
        error: error instanceof Error ? error : new Error('Unknown error')
      });
      throw error;
    }
  }

  async initializeQuantumSystems(): Promise<void> {
    if (this.quantumInitialized) return;

    try {
      this.updateStage('Initializing quantum systems...');
      if (!this.actor) throw new Error('Actor not initialized');

      // Initialize quantum systems on the canister
      const initResult = await this.actor.initialize_quantum_systems();
      if ('Err' in initResult) {
        throw new Error(`Quantum initialization failed: ${initResult.Err}`);
      }

      // Verify quantum readiness
      const status = await this.actor.check_initialization();
      if ('Err' in status) {
        throw new Error(`Failed to check initialization: ${status.Err}`);
      }

      if (!status.Ok.config_status.quantum_ready) {
        throw new Error('Quantum systems failed to initialize');
      }

      // Initialize local quantum state manager
      await this.quantumStateManager.initialize();

      this.quantumInitialized = true;
      this.systemStatus = 'quantum_ready';
      this.updateStage('Quantum systems initialized');

    } catch (error) {
      await this.errorTracker.trackError({
        errorType: 'QUANTUM_INIT_ERROR',
        severity: 'HIGH',
        context: 'Quantum System Initialization',
        error: error instanceof Error ? error : new Error('Quantum initialization failed')
      });
      throw error;
    }
  }

  getActor(): AnimaService | null {
    return this.actor;
  }

  getIdentity(): Identity | null {
    return this.identity;
  }

  getAgent(): HttpAgent | null {
    return this.agent;
  }

  getAuthClient(): AuthClient | null {
    return this.authClient;
  }

  getQuantumStateManager(): QuantumStateManager {
    return this.quantumStateManager;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  isQuantumReady(): boolean {
    return this.quantumInitialized;
  }

  getSystemStatus(): SystemStatus {
    return this.systemStatus;
  }
}

declare global {
  interface Window {
    ic: {
      agent: HttpAgent | null;
      HttpAgent: any;
    };
    canister: AnimaService | null;
  }
}

export const icManager = ICManager.getInstance();

// Initialize immediately
icManager.initialize().catch(console.error);