import { Actor, ActorSubclass, Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { _SERVICE } from "./declarations/anima/anima.did";
import { createActor } from "./declarations/anima";

export interface AuthState {
  client: AuthClient | null;
  actor: ActorSubclass<_SERVICE> | null;
  identity: Identity | null;
  isAuthenticated: boolean;
  principal: Principal | null;
  isOpenAIConfigured: boolean;
}

class AuthManager {
  private static instance: AuthManager;
  private authState: AuthState = {
    client: null,
    actor: null,
    identity: null,
    isAuthenticated: false,
    principal: null,
    isOpenAIConfigured: false,
  };

  private constructor() {}

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  public getState(): AuthState {
    return this.authState;
  }

  public async initialize(): Promise<void> {
    try {
      const client = await AuthClient.create();
      this.authState.client = client;

      if (await client.isAuthenticated()) {
        await this.handleAuthenticated(client);
      }
    } catch (err) {
      console.error("Failed to initialize auth:", err);
      throw err;
    }
  }

  private async handleAuthenticated(client: AuthClient) {
    const identity = client.getIdentity();
    const principal = identity.getPrincipal();

    const actor = createActor(process.env.CANISTER_ID_ANIMA!, {
      agentOptions: {
        identity,
        host: process.env.DFX_NETWORK === "ic" 
          ? "https://ic0.app" 
          : `http://${process.env.CANISTER_ID_ANIMA}.localhost:4943`,
      },
    });

    this.authState = {
      ...this.authState,
      client,
      actor,
      identity,
      isAuthenticated: true,
      principal,
    };
  }

  public async configureOpenAI(apiKey: string): Promise<void> {
    if (!this.authState.actor) {
      throw new Error("Not authenticated");
    }

    try {
      const result = await this.authState.actor.set_openai_api_key(apiKey);
      if ('Ok' in result) {
        this.authState.isOpenAIConfigured = true;
        // Store API key in sessionStorage for persistence during the session
        sessionStorage.setItem('openai_configured', 'true');
      } else {
        throw new Error('Failed to configure OpenAI');
      }
    } catch (error) {
      console.error('Failed to configure OpenAI:', error);
      throw error;
    }
  }

  public async createAnima(name: string, apiKey: string): Promise<any> {
    if (!this.authState.actor) {
      throw new Error("Not authenticated");
    }

    try {
      // First configure OpenAI
      await this.configureOpenAI(apiKey);
      
      // Then create the Anima
      const result = await this.authState.actor.create_anima(name);
      if ('Ok' in result) {
        return {
          anima_id: result.Ok,
          name,
          creation_time: Date.now()
        };
      } else {
        throw new Error('Failed to create Anima');
      }
    } catch (error) {
      console.error("Failed to create anima:", error);
      throw error;
    }
  }

  public async checkInitialization(): Promise<boolean> {
    if (!this.authState.actor || !this.authState.principal) {
      console.log("No actor or principal available");
      return false;
    }

    try {
      // Instead of get_user_state, we'll use get_anima to check if the user has an Anima
      const result = await this.authState.actor.get_anima(this.authState.principal);
      console.log("Check initialization result:", result);
      
      // If we get an Ok result, the user is initialized
      return 'Ok' in result;
    } catch (error) {
      console.error("Failed to check initialization:", error);
      return false;
    }
  }

  public async login(): Promise<void> {
    if (!this.authState.client) {
      throw new Error("Auth client not initialized");
    }

    return new Promise((resolve, reject) => {
      this.authState.client!.login({
        identityProvider: process.env.II_URL || "https://identity.ic0.app",
        onSuccess: async () => {
          try {
            await this.handleAuthenticated(this.authState.client!);
            // Check if OpenAI was previously configured
            if (sessionStorage.getItem('openai_configured')) {
              this.authState.isOpenAIConfigured = true;
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        onError: reject,
      });
    });
  }

  public async logout(): Promise<void> {
    if (!this.authState.client) return;

    await this.authState.client.logout();
    sessionStorage.removeItem('openai_configured');
    this.authState = {
      client: this.authState.client,
      actor: null,
      identity: null,
      isAuthenticated: false,
      principal: null,
      isOpenAIConfigured: false,
    };
  }
}

export const authManager = AuthManager.getInstance();
export default authManager;