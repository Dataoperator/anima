import { AuthClient } from "@dfinity/auth-client";
import { II_URL } from "./ii-config";
import { Actor, Identity } from "@dfinity/agent";
import { canisterId, createActor } from "./declarations/anima";

class AuthManager {
  private authClient: AuthClient | null = null;
  private actor: any | null = null;
  private identity: Identity | null = null;

  constructor() {
    this.init().catch(console.error);
  }

  async init() {
    console.log("Initializing AuthManager...");
    this.authClient = await AuthClient.create({
      idleOptions: {
        disableIdle: true,
        idleTimeout: 1000 * 60 * 30
      }
    });

    console.log("AuthClient created, checking authentication...");
    if (await this.authClient.isAuthenticated()) {
      console.log("User is authenticated, initializing actor...");
      await this.initializeActor(this.authClient.getIdentity());
    } else {
      console.log("User is not authenticated");
    }

    return this.authClient;
  }

  private async initializeActor(identity: Identity) {
    console.log("Initializing actor with identity...");
    try {
      this.identity = identity;
      this.actor = createActor(canisterId, {
        agentOptions: {
          identity,
          host: "https://icp0.io"
        },
      });
      console.log("Actor initialized successfully");
    } catch (error) {
      console.error("Actor initialization failed:", error);
      throw error;
    }
  }

  async login() {
    console.log("Starting login process...");
    if (!this.authClient) {
      console.log("AuthClient not initialized, initializing...");
      await this.init();
    }

    return new Promise((resolve, reject) => {
      const loginOptions = {
        identityProvider: II_URL,
        derivationOrigin: window.location.origin,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        onSuccess: async () => {
          console.log("Login successful, getting identity...");
          const identity = this.authClient?.getIdentity();
          if (identity) {
            console.log("Identity obtained, initializing actor...");
            await this.initializeActor(identity);
            resolve(identity);
          } else {
            console.error("No identity after login");
            reject(new Error("Failed to get identity after login"));
          }
        },
        onError: (error: Error) => {
          console.error("Login error:", error);
          reject(error);
        }
      };

      console.log("Calling authClient.login...");
      this.authClient?.login(loginOptions);
    });
  }

  async logout() {
    console.log("Starting logout process...");
    if (this.authClient) {
      await this.authClient.logout();
      this.actor = null;
      this.identity = null;
      console.log("Logout successful");
      window.location.reload();
    }
  }

  async isAuthenticated() {
    if (!this.authClient) {
      console.log("AuthClient not initialized for isAuthenticated check");
      return false;
    }
    const authenticated = await this.authClient.isAuthenticated();
    console.log("Authentication status:", authenticated);
    return authenticated;
  }

  getIdentity() {
    return this.identity;
  }

  getActor() {
    if (!this.actor) {
      console.warn("Actor requested but not initialized");
    }
    return this.actor;
  }

  async refreshSession() {
    console.log("Refreshing session...");
    if (this.authClient && await this.authClient.isAuthenticated()) {
      const identity = this.authClient.getIdentity();
      await this.initializeActor(identity);
      console.log("Session refreshed successfully");
      return true;
    }
    console.log("Session refresh failed - not authenticated");
    return false;
  }
}

export const authManager = new AuthManager();