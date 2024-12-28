import { AuthClient } from "@dfinity/auth-client";
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "@/declarations/anima/anima.did";
import { createActor } from "@/declarations/anima";
import { canisterId } from "@/declarations/anima/index";
import { Identity } from "@dfinity/agent";

export interface AuthManager {
  isAuthenticated(): Promise<boolean>;
  login(): Promise<Identity>;
  logout(): Promise<void>;
  getIdentity(): Identity;
  getActor(): ActorSubclass<_SERVICE>;
  updateActivity(): void;
}

class Auth implements AuthManager {
  private authClient: AuthClient | null = null;
  private actor: ActorSubclass<_SERVICE> | null = null;
  private lastActivity: number = Date.now();

  constructor() {
    this.setupActivityTracking();
  }

  private setupActivityTracking() {
    setInterval(() => {
      if (Date.now() - this.lastActivity > 30 * 60 * 1000) { // 30 minutes
        void this.logout();
      }
    }, 60 * 1000); // Check every minute
  }

  public async init(): Promise<void> {
    this.authClient = await AuthClient.create();
    await this.checkAuthentication();
  }

  public async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }
    return this.authClient.isAuthenticated();
  }

  public async login(): Promise<Identity> {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }

    return new Promise<Identity>((resolve, reject) => {
      this.authClient?.login({
        identityProvider: process.env.II_URL || 'https://identity.ic0.app',
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
        onSuccess: async () => {
          const identity = this.authClient!.getIdentity();
          await this.setupActor(identity);
          resolve(identity);
        },
        onError: (error) => {
          reject(new Error(error));
        }
      });
    });
  }

  public async logout(): Promise<void> {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }
    await this.authClient.logout();
    this.actor = null;
  }

  public getIdentity(): Identity {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }
    return this.authClient.getIdentity();
  }

  public getActor(): ActorSubclass<_SERVICE> {
    if (!this.actor) {
      throw new Error("Actor not initialized");
    }
    return this.actor;
  }

  public updateActivity(): void {
    this.lastActivity = Date.now();
  }

  private async checkAuthentication(): Promise<void> {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }

    if (await this.authClient.isAuthenticated()) {
      const identity = this.authClient.getIdentity();
      await this.setupActor(identity);
    }
  }

  private async setupActor(identity: Identity): Promise<void> {
    this.actor = createActor(canisterId, {
      agentOptions: {
        identity,
      }
    });
  }
}

let authInstance: Auth | null = null;

export async function getAuthManager(): Promise<AuthManager> {
  if (!authInstance) {
    authInstance = new Auth();
    await authInstance.init();
  }
  return authInstance;
}