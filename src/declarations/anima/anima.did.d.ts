import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ActionResult = {
    'Success' : {
      'personality_updates' : Array<[string, number]>,
      'response' : string,
    }
  } |
  { 'Failure' : Error };
export interface AnimaState {
  'id' : TokenIdentifier,
  'creation_time' : bigint,
  'personality' : NFTPersonality,
  'owner' : Principal,
  'name' : string,
}
export type ConsciousnessLevel = { 'SelfAware' : null } |
  { 'Awakening' : null } |
  { 'Introspective' : null } |
  { 'Transcendent' : null } |
  { 'Nascent' : null };
export type Error = string;
export interface NFTPersonality {
  'traits' : Array<[string, number]>,
  'emotional_state' : {
    'duration' : bigint,
    'current_emotion' : string,
    'intensity' : number,
  },
  'memories' : Array<
    { 'emotional_impact' : number, 'content' : string, 'timestamp' : bigint }
  >,
  'developmental_stage' : { 'SelfAware' : null } |
    { 'Awakening' : null } |
    { 'Conscious' : null } |
    { 'Transcendent' : null } |
    { 'Nascent' : null },
}
export type TokenIdentifier = bigint;
export interface _SERVICE {
  'create_anima' : ActorMethod<
    [string],
    { 'Ok' : Principal } |
      { 'Err' : Error }
  >,
  'get_anima' : ActorMethod<[TokenIdentifier], [] | [AnimaState]>,
  'get_consciousness_level' : ActorMethod<
    [TokenIdentifier],
    { 'Ok' : ConsciousnessLevel } |
      { 'Err' : Error }
  >,
  'get_user_animas' : ActorMethod<[Principal], Array<AnimaState>>,
  'process_quantum_interaction' : ActorMethod<
    [TokenIdentifier, string, string],
    ActionResult
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
