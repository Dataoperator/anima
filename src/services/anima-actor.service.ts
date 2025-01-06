import { Identity } from "@dfinity/agent";
import { createActor } from "@/declarations/anima";
import type { _SERVICE } from '@/declarations/anima/anima.did';

const CANISTER_ID = process.env.CANISTER_ID_ANIMA?.toString() || 'l2ilz-iqaaa-aaaaj-qngjq-cai';

export class AnimaActorService {
  private static instance: AnimaActorService;
  private actor: _SERVICE | null = null;

  private constructor() {}

  static getInstance(): AnimaActorService {
    if (!AnimaActorService.instance) {
      AnimaActorService.instance = new AnimaActorService();
    }
    return AnimaActorService.instance;
  }

  createActor(identity: Identity): _SERVICE {
    this.actor = createActor(CANISTER_ID, {
      agentOptions: {
        identity,
        host: "https://icp0.io"
      }
    });
    return this.actor;
  }

  getActor(): _SERVICE | null {
    return this.actor;
  }
}

export const animaActorService = AnimaActorService.getInstance();