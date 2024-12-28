import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface AnimaNFT {
  'listing_price' : [] | [bigint],
  'creation_time' : bigint,
  'personality' : NFTPersonality,
  'token_id' : bigint,
  'last_interaction' : bigint,
  'owner' : Principal,
  'name' : string,
  'level' : number,
  'traits_locked' : boolean,
  'autonomous_enabled' : boolean,
  'growth_points' : number,
  'approved_address' : [] | [Principal],
}
export type Error = { 'Configuration' : string } |
  { 'PaymentFailed' : null } |
  { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'InvalidToken' : null } |
  { 'AlreadyInitialized' : null } |
  { 'External' : string } |
  { 'TransferFailed' : null };
export type InteractionResponse = { 'Ok' : InteractionResult } |
  { 'Err' : Error };
export interface InteractionResult {
  'memory' : Memory,
  'personality_updates' : Array<[string, number]>,
  'is_autonomous' : boolean,
  'response' : string,
}
export interface Memory {
  'emotional_impact' : number,
  'description' : string,
  'keywords' : Array<string>,
  'timestamp' : bigint,
  'importance_score' : number,
  'event_type' : string,
}
export interface NFTPersonality {
  'interaction_count' : number,
  'traits' : Array<[string, number]>,
  'memories' : Array<Memory>,
}
export type Result = { 'Ok' : bigint } |
  { 'Err' : Error };
export type UserState = {
    'Initialized' : { 'name' : string, 'anima_id' : Principal }
  } |
  { 'NotInitialized' : null };
export interface _SERVICE {
  'check_initialization' : ActorMethod<[bigint], [] | [InteractionResult]>,
  'get_anima' : ActorMethod<[bigint], [] | [AnimaNFT]>,
  'get_user_state' : ActorMethod<[[] | [Principal]], UserState>,
  'icrc7_name' : ActorMethod<[], string>,
  'interact' : ActorMethod<[bigint, string], InteractionResponse>,
  'mint_anima' : ActorMethod<[string], Result>,
}
