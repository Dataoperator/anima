import { Actor, Identity, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "./declarations/anima";

// Initialize environment with safe fallbacks
const CANISTER_ID = {
  anima: process.env.CANISTER_ID_ANIMA?.toString() || 'l2ilz-iqaaa-aaaaj-qngjq-cai',
  assets: process.env.CANISTER_ID_ANIMA_ASSETS?.toString() || 'lpp2u-jyaaa-aaaaj-qngka-cai'
};

// Always use mainnet for production
const HOST = 'https://icp0.io';

type StageChangeCallback = (stage: string) => void;

class ICManager {
  private static instance: ICManager;
  private actor: Actor | null = null;
  private agent: HttpAgent | null = null;
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;
  private initialized = false;
  private initializing = false;
  private stageChangeCallbacks: StageChangeCallback[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      // Initialize window.ic safely
      window.ic = {
        ...(window.ic || {}),
        agent: null,
        Actor,
        HttpAgent
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
      console.log('Starting IC initialization...');

      this.updateStage('Creating AuthClient...');
      this.authClient = await AuthClient.create({
        idleOptions: { disableIdle: true }
      });
      
      this.updateStage('Getting identity...');
      this.identity = this.authClient.getIdentity();
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

      // Verify canister ID format
      const canisterId = CANISTER_ID.anima?.replace(/['"]/g, '');
      if (!canisterId) {
        throw new Error('Invalid canister ID');
      }

      this.updateStage('Creating Actor...');
      this.actor = await createActor(canisterId, {
        agent: this.agent
      });

      this.updateStage('Setting up window.ic...');
      window.ic = {
        ...(window.ic || {}),
        agent: this.agent,
        Actor,
        HttpAgent
      };

      if (this.actor) {
        window.canister = this.actor;
      }
      
      this.initialized = true;
      this.initializing = false;
      this.updateStage('Initialization complete!');
      
      console.log('🔍 Feature check:', {
        canister: !!window.canister,
        ic: !!window.ic,
        agent: !!this.agent,
        identity: !!this.identity
      });

    } catch (error) {
      this.initializing = false;
      console.error('IC initialization failed:', {
        error,
        canisterId: CANISTER_ID.anima,
        stage: this.initialized ? 'post-init' : 'pre-init'
      });
      throw error;
    }
  }

  getActor(): Actor {
    if (!this.initialized || !this.actor) {
      throw new Error("IC not initialized. Call initialize() first.");
    }
    return this.actor;
  }

  getIdentity(): Identity | null {
    return this.identity;
  }

  getAgent(): HttpAgent | null {
    return this.agent;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

// For debugging
declare global {
  interface Window {
    ic: {
      agent: HttpAgent | null;
      Actor: any;
      HttpAgent: any;
    };
    canister: any;
  }
}

export const icManager = ICManager.getInstance();