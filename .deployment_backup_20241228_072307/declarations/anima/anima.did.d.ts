import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Alert {
  'id' : string,
  'resolved' : boolean,
  'title' : string,
  'message' : string,
  'timestamp' : bigint,
  'severity' : string,
}
export interface AlertAction {
  'action_type' : string,
  'payload' : { 'Custom' : { 'data' : string } } |
    { 'Escalate' : { 'priority' : string } } |
    { 'Acknowledge' : null },
}
export interface HealthStatus {
  'status' : string,
  'memory_used' : bigint,
  'cycles' : bigint,
  'heap_memory' : bigint,
}
export interface Listing {
  'token_id' : TokenIdentifier,
  'created_at' : bigint,
  'seller' : Principal,
  'price' : bigint,
  'expires_at' : [] | [bigint],
}
export interface PersonalityState {
  'emotional_state' : [] | [
    {
      'valence' : number,
      'current_emotion' : string,
      'arousal' : number,
      'intensity' : number,
    }
  ],
  'growth_level' : number,
  'consciousness' : [] | [
    {
      'awareness_level' : number,
      'growth_velocity' : number,
      'processing_depth' : number,
      'integration_index' : number,
    }
  ],
  'timestamp' : bigint,
  'dimensional_awareness' : [] | [
    {
      'level' : number,
      'discovered_dimensions' : Array<string>,
      'active_dimension' : [] | [string],
    }
  ],
}
export interface SystemStats {
  'memory_usage_percent' : number,
  'total_transactions' : bigint,
  'total_animas' : bigint,
  'active_users' : bigint,
}
export type TokenIdentifier = bigint;
export interface _SERVICE {
  'create_anima' : ActorMethod<
    [string],
    { 'Ok' : Principal } |
      { 'Err' : string }
  >,
  'get_growth_history' : ActorMethod<
    [],
    Array<{ 'nfts' : bigint, 'time' : string, 'users' : bigint }>
  >,
  'get_health_status' : ActorMethod<[], HealthStatus>,
  'get_marketplace_listings' : ActorMethod<[], Array<Listing>>,
  'get_payment_address' : ActorMethod<[], string>,
  'get_payment_amount' : ActorMethod<
    [
      { 'Creation' : null } |
        { 'Upgrade' : null } |
        { 'Growth' : null } |
        { 'Resurrection' : null },
    ],
    bigint
  >,
  'get_personality_state' : ActorMethod<[TokenIdentifier], PersonalityState>,
  'get_system_alerts' : ActorMethod<[], Array<Alert>>,
  'get_system_stats' : ActorMethod<[], SystemStats>,
  'get_user_animas' : ActorMethod<
    [],
    Array<{ 'id' : TokenIdentifier, 'owner' : Principal, 'name' : string }>
  >,
  'handle_alert_action' : ActorMethod<
    [AlertAction],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'list_token' : ActorMethod<
    [TokenIdentifier, bigint, [] | [bigint]],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'verify_payment' : ActorMethod<[bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
