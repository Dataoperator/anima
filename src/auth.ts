import { Actor, ActorSubclass, Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { _SERVICE, InteractionResult } from "./declarations/anima/anima.did";
import { createActor } from "./declarations/anima";

export interface AuthState {
  client: AuthClient | null;
  actor: ActorSubclass<_SERVICE> | null;
  identity: Identity | null;
  isAuthenticated: boolean;
  principal: Principal | null;
  isOpenAIConfigured: boolean;
}

class AuthError extends Error {
  constructor(message: string, public code?: string) {
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
        actor,
        identity,
        principal: identity.getPrincipal(),
        isAuthenticated: true,
      };

      // Check if OpenAI is already configured
      const state = await actor.get_user_state([this.authState.principal]);
      if ('Initialized' in state) {
        this.authState.isOpenAIConfigured = true;
      }
    } catch (error) {
      throw new AuthError('Failed to initialize actor', 'ACTOR_INIT_FAILED');
    }
  }

  async configureOpenAI(apiKey: string): Promise<void> {
    if (!this.authState.actor) {
      throw new AuthError('Not authenticated', 'NOT_AUTHENTICATED');
    }

    try {
      const result = await this.authState.actor.set_openai_config(apiKey);
      if ('Ok' in result) {
        this.authState.isOpenAIConfigured = true;
        sessionStorage.setItem('openai_configured', 'true');
      } else if ('Err' in result) {
        throw new Error('Configuration error: ' + ('Configuration' in result.Err ? result.Err.Configuration : 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to configure OpenAI:', error);
      throw new AuthError('Failed to configure OpenAI API', 'OPENAI_CONFIG_FAILED');
    }
  }

  async createAnima(name: string): Promise<InteractionResult> {
    if (!this.authState.actor) {
      throw new AuthError('Not authenticated', 'NOT_AUTHENTICATED');
    }

    try {
      const result = await this.authState.actor.create_anima(name);
      if ('Ok' in result) {
        // Get the newly created Anima's information
        const animaResult = await this.authState.actor.get_anima(result.Ok);
        if ('Ok' in animaResult) {
          return {
            response: 'Successfully created Anima',
            personality_updates: [],
            memory: {
              timestamp: BigInt(Date.now()),
              event_type: { Initial: null },
              description: 'Anima created',
              emotional_impact: 0,
              importance_score: 1,
              keywords: ['creation']
            },
            is_autonomous: false
          };
        } else {
          throw new Error('Failed to fetch created Anima');
        }
      } else {
        throw new Error('Configuration error: ' + ('Configuration' in result.Err ? result.Err.Configuration : 'Unknown error'));
      }
    } catch (error) {
      console.error("Failed to create anima:", error);
      throw new AuthError('Failed to create Anima', 'CREATE_ANIMA_FAILED');
    }
  }

  async initialize(): Promise<void> {
    try {
      const client = await AuthClient.create();
      this.authState.client = client;

      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        await this.initActor(identity);
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      throw new AuthError(
        error instanceof Error ? error.message : 'Authentication initialization failed',
        'INIT_FAILED'
      );
    }
  }

  async login(): Promise<void> {
    if (!this.authState.client) {
      throw new AuthError('Auth client not initialized', 'CLIENT_NOT_INITIALIZED');
    }

    return new Promise((resolve, reject) => {
      this.authState.client!.login({
        identityProvider: process.env.II_URL || "https://identity.ic0.app",
        onSuccess: async () => {
          try {
            const identity = this.authState.client!.getIdentity();
            await this.initActor(identity);
            resolve();
          } catch (error) {
            reject(new AuthError('Failed to complete login', 'LOGIN_FAILED'));
          }
        },
        onError: (error) => {
          reject(new AuthError(error.message, 'LOGIN_ERROR'));
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