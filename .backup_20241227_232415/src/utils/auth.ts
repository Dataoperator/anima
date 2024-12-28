import { Identity } from '@dfinity/agent';
import { createActor } from '@/declarations/anima';

export class AuthManager {
  private static instance: AuthManager | null = null;
  private identity: Identity | null = null;

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  setIdentity(identity: Identity) {
    this.identity = identity;
  }

  getIdentity(): Identity | null {
    return this.identity;
  }

  getActor() {
    if (!this.identity) {
      throw new Error('No identity set');
    }
    return createActor(this.identity);
  }
}