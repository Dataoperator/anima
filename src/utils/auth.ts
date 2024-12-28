import { Identity, ActorSubclass } from '@dfinity/agent';
import { createActor } from '@/declarations/anima';
import { _SERVICE } from '@/declarations/anima/anima.did';

export class AuthManager {
  private static instance: AuthManager | null = null;
  private identity: Identity | null = null;
  private actor: ActorSubclass<_SERVICE> | null = null;

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  setIdentity(identity: Identity) {
    this.identity = identity;
    if (this.identity) {
      this.actor = createActor({ agentOptions: { identity } });
    }
  }

  getIdentity(): Identity | null {
    return this.identity;
  }

  getActor(): ActorSubclass<_SERVICE> {
    if (!this.actor) {
      throw new Error('No actor available - identity not set');
    }
    return this.actor;
  }
}