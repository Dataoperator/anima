import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AnimaToken {
  'id' : TokenIdentifier,
  'creation_time' : bigint,
  'personality' : NFTPersonality,
  'last_interaction' : bigint,
  'owner' : Principal,
  'metadata' : [] | [TokenMetadata],
  'interaction_history' : Array<InteractionRecord>,
  'name' : string,
  'level' : number,
  'growth_points' : bigint,
  'autonomous_mode' : boolean,
}
export type Error = string;
export interface InteractionRecord { 'message' : string, 'timestamp' : bigint }
export interface MetadataAttribute { 'trait_type' : string, 'value' : string }
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
export interface TokenMetadata {
  'name' : string,
  'description' : [] | [string],
  'attributes' : Array<MetadataAttribute>,
  'image' : [] | [string],
}
export interface _SERVICE {
  'create_anima' : ActorMethod<
    [string],
    { 'Ok' : Principal } |
      { 'Err' : Error }
  >,
  'get_anima' : ActorMethod<[TokenIdentifier], [] | [AnimaToken]>,
  'get_user_animas' : ActorMethod<[Principal], Array<AnimaToken>>,
  'transfer_anima' : ActorMethod<
    [Principal, TokenIdentifier],
    { 'Ok' : null } |
      { 'Err' : Error }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
