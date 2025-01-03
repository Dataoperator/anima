import { Actor, Identity, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "./declarations/anima";
import type { _SERVICE } from "./declarations/anima/anima.did";

// Network configurations
const DFX_NETWORK = process.env.DFX_NETWORK || "ic";
const IS_LOCAL = DFX_NETWORK === "local";

// Canister IDs - these should match your dfx.json
export const CANISTER_IDS = {
  anima: process.env.ANIMA_CANISTER_ID || "l2ilz-iqaaa-aaaaj-qngjq-cai", // Your production ID
  assets: process.env.ASSETS_CANISTER_ID || "lpp2u-jyaaa-aaaaj-qngka-cai"  // Your assets ID
};

// Host configuration
const HOST = IS_LOCAL ? "http://localhost:4943" : "https://icp0.io";

class ICManager {
  private static instance: ICManager;
  private actor: Actor | null = null;
  private agent: HttpAgent | null = null;
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): ICManager {
    if (!ICManager.instance) {
      ICManager.instance = new ICManager();
    }
    return ICManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log("Initializing Internet Computer connection...");
      
      // Create auth client
      this.authClient = await AuthClient.create();
      this.identity = this.authClient.getIdentity();

      // Initialize agent
      this.agent = new HttpAgent({
        identity: this.identity,
        host: HOST
      });

      // When in development, we need to fetch root key
      if (IS_LOCAL) {
        await this.agent.fetchRootKey();
      }

      // Create actor
      this.actor = createActor(CANISTER_IDS.anima, {
        agent: this.agent
      }) as unknown as Actor;

      this.initialized = true;
      console.log("IC initialization complete");
    } catch (error) {
      console.error("IC initialization failed:", error);
      throw error;
    }
  }

  getActor<T = _SERVICE>(): T {
    if (!this.initialized || !this.actor) {
      throw new Error("IC not initialized. Call initialize() first.");
    }
    return this.actor as unknown as T;
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

  async login(): Promise<boolean> {
    if (!this.authClient) throw new Error("Auth client not initialized");
    
    return new Promise((resolve) => {
      this.authClient!.login({
        identityProvider: process.env.II_URL || "https://identity.ic0.app",
        onSuccess: () => {
          this.identity = this.authClient!.getIdentity();
          if (this.agent) {
            this.agent.replaceIdentity(this.identity);
          }
          resolve(true);
        },
        onError: () => resolve(false)
      });
    });
  }

  async logout(): Promise<void> {
    if (!this.authClient) throw new Error("Auth client not initialized");
    await this.authClient.logout();
    // Reset identity to anonymous after logout
    this.identity = await AuthClient.create().then(client => client.getIdentity());
    if (this.agent) {
      this.agent.replaceIdentity(this.identity);
    }
  }
}

export const icManager = ICManager.getInstance();