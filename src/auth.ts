import { Actor, ActorSubclass, Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { _SERVICE } from "./declarations/anima/anima.did";
import { createActor } from "./declarations/anima";

const ANIMA_CANISTER_ID = "l2ilz-iqaaa-aaaaj-qngjq-cai";
const IS_MAINNET = true;

export enum ErrorType {
  Configuration = "Configuration",
  NotFound = "NotFound",
  NotAuthorized = "NotAuthorized",
  AlreadyInitialized = "AlreadyInitialized",
  External = "External"
}

export interface AuthState {
  client: AuthClient | null;
  actor: ActorSubclass<_SERVICE> | null;
  identity: Identity | null;
  isAuthenticated: boolean;
  principal: Principal | null;
  isOpenAIConfigured: boolean;
}

class AuthError extends Error {
  constructor(message: string, public code?: ErrorType) {
    super(message);
    this.name = 'AuthError';
  }
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
    return { ...this.authState };
  }

  private async initActor(identity: Identity): Promise<void> {
    try {
      const actor = createActor(ANIMA_CANISTER_ID, {
        agentOptions: {
          identity,
          host: IS_MAINNET 
            ? "https://ic0.app" 
            : "http://localhost:4943",
        },
      });

      this.authState = {
        ...this.authState,
        actor,
        identity,
        principal: identity.getPrincipal(),
        isAuthenticated: true,
      };

      try {
        const response = await actor.get_anima(identity.getPrincipal());
        if ('Ok' in response) {
          this.authState.isOpenAIConfigured = true;
        }
      } catch (error) {
        console.warn('Could not verify OpenAI configuration - continuing without verification');
      }
    } catch (error) {
      console.error('Actor initialization failed:', error);
      throw new AuthError('Failed to initialize actor', ErrorType.Configuration);
    }
  }

  async checkInitialization(): Promise<boolean> {
    if (!this.authState.actor || !this.authState.principal) {
      return false;
    }

    try {
      const response = await this.authState.actor.get_anima(this.authState.principal);
      return 'Ok' in response;
    } catch (error) {
      console.error('Check initialization failed:', error);
      return false;
    }
  }

  async configureOpenAI(apiKey: string): Promise<void> {
    if (!this.authState.actor) {
      throw new AuthError('Not authenticated', ErrorType.NotAuthorized);
    }

    try {
      const result = await this.authState.actor.set_openai_config(apiKey);
      if ('Ok' in result) {
        this.authState.isOpenAIConfigured = true;
        sessionStorage.setItem('openai_configured', 'true');
      } else {
        throw new Error(result.Err[0] || 'Unknown error');
      }
    } catch (error: any) {
      console.error('Failed to configure OpenAI:', error);
      throw new AuthError(error.message || 'Failed to configure OpenAI API', ErrorType.Configuration);
    }
  }

  async initialize(): Promise<void> {
    try {
      const client = await AuthClient.create({
        idleOptions: {
          idleTimeout: 1000 * 60 * 30, // 30 minutes
          disableDefaultIdleCallback: true
        }
      });
      
      this.authState.client = client;

      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        await this.initActor(identity);
      }
    } catch (error: any) {
      console.error("Failed to initialize auth:", error);
      throw new AuthError(error.message || 'Authentication initialization failed', ErrorType.Configuration);
    }
  }

  async login(): Promise<void> {
    if (!this.authState.client) {
      throw new AuthError('Auth client not initialized', ErrorType.Configuration);
    }

    return new Promise((resolve, reject) => {
      this.authState.client!.login({
        identityProvider: IS_MAINNET 
          ? "https://identity.ic0.app"
          : `http://localhost:4943/?canisterId=${ANIMA_CANISTER_ID}`,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days
        onSuccess: async () => {
          try {
            const identity = this.authState.client!.getIdentity();
            await this.initActor(identity);
            resolve();
          } catch (error: any) {
            console.error('Login completion failed:', error);
            reject(new AuthError(error.message || 'Failed to complete login', ErrorType.Configuration));
          }
        },
        onError: (error) => {
          console.error('Login error:', error);
          reject(new AuthError(error.message || 'Login failed', ErrorType.External));
        },
      });
    });
  }

  async logout(): Promise<void> {
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