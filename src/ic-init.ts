import { Actor, Identity, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "./declarations/anima";
import type { _SERVICE } from "./declarations/anima/anima.did";

// Network configurations
const DFX_NETWORK = process.env.DFX_NETWORK || "ic";
const IS_LOCAL = DFX_NETWORK === "local";

// Canister IDs - these should match your dfx.json
export const CANISTER_IDS = {
  anima: process.env.ANIMA_CANISTER_ID || "l2ilz-iqaaa-aaaaj-qngjq-cai",
  assets: process.env.ASSETS_CANISTER_ID || "lpp2u-jyaaa-aaaaj-qngka-cai"
};

// Host configuration
const HOST = IS_LOCAL ? "http://localhost:4943" : "https://icp0.io";

declare global {
  interface Window {
    ic?: any;
    canister?: any;
  }
}

class ICManager {
  private static instance: ICManager;
  private actor: Actor | null = null;
  private agent: HttpAgent | null = null;
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;
  private retryCount = 0;
  private maxRetries = 3;

  private constructor() {}

  static getInstance(): ICManager {
    if (!ICManager.instance) {
      ICManager.instance = new ICManager();
    }
    return ICManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this.initializeInternal();
    return this.initializationPromise;
  }

  private async initializeInternal(): Promise<void> {
    try {
      console.log("🔄 Initializing IC connection...");

      // Create auth client first
      console.log("🔄 Creating auth client...");
      this.authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true
        }
      });
      
      this.identity = this.authClient.getIdentity();
      console.log("✅ Auth client created");

      // Initialize agent
      console.log("🔄 Initializing agent...");
      this.agent = new HttpAgent({
        identity: this.identity,
        host: HOST,
        verifyQuerySignatures: false // Add this for development
      });

      if (IS_LOCAL) {
        await this.agent.fetchRootKey().catch(console.error);
      }
      console.log("✅ Agent initialized");

      // Create actor
      console.log("🔄 Creating actor...");
      this.actor = createActor(CANISTER_IDS.anima, {
        agent: this.agent
      }) as unknown as Actor;

      // Initialize window.ic if needed
      if (!window.ic) {
        window.ic = {
          agent: this.agent,
          Actor,
          HttpAgent
        };
      }

      // Set canister
      window.canister = this.actor;

      this.initialized = true;
      console.log("✅ IC initialization complete");

      // Verify features after short delay to ensure everything is ready
      setTimeout(() => {
        const features = this.verifyFeatures();
        console.log("🔍 IC Features verified:", features);
      }, 100);

    } catch (error) {
      console.error("❌ IC initialization failed:", error);
      
      if (this.retryCount < this.maxRetries) {
        console.log(`🔄 Retrying initialization (${this.retryCount + 1}/${this.maxRetries})...`);
        this.retryCount++;
        this.initializationPromise = null;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        return this.initialize();
      }

      this.initialized = false;
      this.initializationPromise = null;
      throw error;
    }
  }

  verifyFeatures() {
    const features = {
      canister: !!window.canister,
      ic: !!window.ic,
      agent: !!this.agent,
      identity: !!this.identity
    };
    return features;
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
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
        onSuccess: async () => {
          this.identity = this.authClient!.getIdentity();
          if (this.agent) {
            this.agent.replaceIdentity(this.identity);
            // Reinitialize actor with new identity
            this.actor = createActor(CANISTER_IDS.anima, {
              agent: this.agent
            }) as unknown as Actor;
          }
          resolve(true);
        },
        onError: (error) => {
          console.error("Login failed:", error);
          resolve(false);
        }
      });
    });
  }

  async logout(): Promise<void> {
    if (!this.authClient) throw new Error("Auth client not initialized");
    await this.authClient.logout();
    this.identity = await AuthClient.create().then(client => client.getIdentity());
    if (this.agent) {
      this.agent.replaceIdentity(this.identity);
      // Reinitialize actor with anonymous identity
      this.actor = createActor(CANISTER_IDS.anima, {
        agent: this.agent
      }) as unknown as Actor;
    }
  }
}

export const icManager = ICManager.getInstance();

// Export a helper function to verify IC features
export const verifyICFeatures = () => ({
  canister: !!window.canister,
  ic: !!window.ic,
  agent: !!icManager.getAgent(),
  identity: !!icManager.getIdentity()
});