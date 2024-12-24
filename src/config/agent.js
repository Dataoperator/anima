import { HttpAgent, Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory } from "../../declarations/anima/anima.did.js";

const animaCanisterId = "l2ilz-iqaaa-aaaaj-qngjq-cai";
const host = "https://icp0.io";

export async function createActor() {
  const authClient = await AuthClient.create();
  const agent = new HttpAgent({
    host,
    identity: authClient.getIdentity(),
  });

  if (process.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey().catch((err) => {
      console.warn("Unable to fetch root key. Check your connection and the canister ID:", err);
    });
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: animaCanisterId,
  });
}

export async function getAgent() {
  const authClient = await AuthClient.create();
  return new HttpAgent({
    host,
    identity: authClient.getIdentity(),
  });
}