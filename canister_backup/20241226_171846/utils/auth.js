import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { createAnimaActor } from './auth/createActor';
import { NETWORK_CONFIG } from '@/config';

const AUTH_TIMER_KEY = 'anima_auth_timer';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export class AuthManager {
  static instance = null;
  
  constructor() {
    this.authClient = null;
    this.agent = null;
    this.identity = null;
    this.actor = null;
    this.refreshTimer = null;
  }

  static async getInstance() {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
      try {
        await AuthManager.instance.initialize();
      } catch (error) {
        console.error('Auth manager initialization failed:', error);
        throw error;
      }
    }
    return AuthManager.instance;
  }

  async initialize() {
    try {
      this.authClient = await AuthClient.create({
        idleOptions: {
          idleTimeout: SESSION_TIMEOUT,
          disableDefaultIdleCallback: true
        }
      });

      if (await this.authClient.isAuthenticated()) {
        this.identity = this.authClient.getIdentity();
        
        this.agent = new HttpAgent({
          identity: this.identity,
          host: NETWORK_CONFIG.host
        });

        try {
          this.actor = await createAnimaActor(this.identity);
          this.startRefreshTimer();
        } catch (error) {
          console.error('Actor creation failed:', error);
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      throw new Error('Failed to initialize authentication');
    }
  }

  startRefreshTimer() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    this.updateActivityTimestamp();

    this.refreshTimer = setInterval(() => {
      const lastActivity = parseInt(localStorage.getItem(AUTH_TIMER_KEY) || '0');
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        this.logout();
      }
    }, 60000);
  }

  updateActivityTimestamp() {
    localStorage.setItem(AUTH_TIMER_KEY, Date.now().toString());
  }

  async login() {
    if (!this.authClient) {
      throw new Error('Auth client not initialized');
    }

    return new Promise((resolve, reject) => {
      this.authClient.login({
        identityProvider: 'https://identity.ic0.app',
        maxTimeToLive: BigInt(SESSION_TIMEOUT * 1000000),
        onSuccess: async () => {
          try {
            this.identity = this.authClient.getIdentity();
            this.agent = new HttpAgent({
              identity: this.identity,
              host: NETWORK_CONFIG.host
            });

            this.actor = await createAnimaActor(this.identity);
            this.startRefreshTimer();
            resolve(this.identity);
          } catch (error) {
            reject(error);
          }
        },
        onError: reject
      });
    });
  }

  async logout() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }

    localStorage.removeItem(AUTH_TIMER_KEY);

    if (this.authClient) {
      await this.authClient.logout();
      this.identity = null;
      this.agent = null;
      this.actor = null;
    }
  }

  getIdentity() {
    return this.identity;
  }

  getAgent() {
    return this.agent;
  }

  getActor() {
    return this.actor;
  }

  isAuthenticated() {
    return !!this.identity;
  }

  updateActivity() {
    this.updateActivityTimestamp();
  }
}

export const getAuthManager = () => AuthManager.getInstance();