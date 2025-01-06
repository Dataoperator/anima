import { Identity, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "./declarations/anima";
import type { _SERVICE } from './declarations/anima/anima.did';

const CANISTER_ID = {
  anima: process.env.CANISTER_ID_ANIMA?.toString() || 'l2ilz-iqaaa-aaaaj-qngjq-cai',
  assets: process.env.CANISTER_ID_ANIMA_ASSETS?.toString() || 'lpp2u-jyaaa-aaaaj-qngka-cai'
};

const HOST = 'https://icp0.io';

type StageChangeCallback = (stage: string) => void;

class ICManager {
  private static instance: ICManager;
  private actor: _SERVICE | null = null;
  private agent: HttpAgent | null = null;
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;
  private initialized = false;
  private initializing = false;
  private stageChangeCallbacks: StageChangeCallback[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      window.ic = {
        ...(window.ic || {}),
        agent: null,
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
      if (!this.authClient) {
        this.authClient = await AuthClient.create({
          idleOptions: { disableIdle: true }
        });
      }
      
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

      const canisterId = CANISTER_ID.anima?.replace(/['"]/g, '');
      if (!canisterId) {
        throw new Error('Invalid canister ID');
      }

      this.updateStage('Creating Actor...');
      // Use the imported createActor function
      this.actor = await createActor(canisterId, {
        agent: this.agent,
        agentOptions: {
          host: HOST
        }
      }) as _SERVICE;

      // Verify the actor has the required methods
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
      this.updateStage('Initialization complete!');
      
      console.log('🔍 Feature check:', {
        canister: !!window.canister,
        ic: !!window.ic,
        agent: !!this.agent,
        identity: !!this.identity,
        initialize_genesis: typeof this.actor?.initialize_genesis === 'function'
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

  getActor(): _SERVICE | null {
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

declare global {
  interface Window {
    ic: {
      agent: HttpAgent | null;
      HttpAgent: any;
    };
    canister: _SERVICE | null;
  }
}

export const icManager = ICManager.getInstance();