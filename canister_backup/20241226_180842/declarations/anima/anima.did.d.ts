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
  'developmental_stage' : string,
  'skills' : Array<string>,
}
export interface PaymentSettings {
  'fee_recipient' : Principal,
  'growth_pack_base_fee' : bigint,
  'creation_fee' : bigint,
  'resurrection_fee' : bigint,
}
export interface PaymentStats {
  'average_payment_amount' : bigint,
  'successful_payments' : bigint,
  'total_transactions' : bigint,
  'failed_payments' : bigint,
}
export type PaymentType = { 'Creation' : null } |
  { 'Resurrection' : null } |
  { 'GrowthPack' : bigint };
export type Result = { 'Ok' : bigint } |
  { 'Err' : Error };
export type Result_1 = { 'Ok' : null } |
  { 'Err' : Error };
export type UserState = {
    'Initialized' : { 'name' : string, 'anima_id' : Principal }
  } |
  { 'NotInitialized' : null };
export interface _SERVICE {
  'check_initialization' : ActorMethod<[bigint], [] | [InteractionResult]>,
  'complete_payment' : ActorMethod<[bigint], Result_1>,
  'get_anima' : ActorMethod<[bigint], [] | [AnimaNFT]>,
  'get_payment_settings' : ActorMethod<[], PaymentSettings>,
  'get_payment_stats' : ActorMethod<[], PaymentStats>,
  'get_user_state' : ActorMethod<[[] | [Principal]], UserState>,
  'icrc7_name' : ActorMethod<[], string>,
  'initiate_payment' : ActorMethod<[PaymentType, [] | [bigint]], Result>,
  'interact' : ActorMethod<[bigint, string], InteractionResponse>,
  'mint_anima' : ActorMethod<[string], Result>,
  'resurrect_anima' : ActorMethod<[bigint], Result_1>,
  'update_payment_settings' : ActorMethod<[PaymentSettings], Result_1>,
}
