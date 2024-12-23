import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Anima {
  'creation_time' : bigint,
  'personality' : NFTPersonality,
  'last_interaction' : bigint,
  'owner' : Principal,
  'name' : string,
  'autonomous_enabled' : boolean,
}
export interface AnimaMetrics {
  'total_memories' : bigint,
  'interaction_frequency' : number,
  'avg_emotional_impact' : number,
  'autonomous_ratio' : number,
  'personality_development' : DevelopmentMetrics,
  'avg_importance_score' : number,
}
export interface DevelopmentMetrics {
  'emotional_maturity' : number,
  'learning_curve' : number,
  'trait_stability' : number,
  'growth_rate' : number,
}
export type DevelopmentalStage = { 'Beginner' : null } |
  { 'Advanced' : null } |
  { 'Initial' : null } |
  { 'Intermediate' : null } |
  { 'Expert' : null };
export type Error = { 'Configuration' : string } |
  { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'AlreadyInitialized' : null } |
  { 'External' : string };
export type EventType = { 'LearningMoment' : null } |
  { 'AutonomousThought' : null } |
  { 'Initial' : null } |
  { 'EmotionalResponse' : null } |
  { 'UserInteraction' : null } |
  { 'RelationshipDevelopment' : null };
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
  'event_type' : EventType,
}
export interface NFTPersonality {
  'creation_time' : bigint,
  'interaction_count' : bigint,
  'hash' : [] | [string],
  'traits' : Array<[string, number]>,
  'growth_level' : number,
  'memories' : Array<Memory>,
  'developmental_stage' : DevelopmentalStage,
}
export type Result_1 = { 'Ok' : Principal } |
  { 'Err' : Error };
export type Result_2 = { 'Ok' : Anima } |
  { 'Err' : Error };
export type Result_3 = { 'Ok' : InteractionResult } |
  { 'Err' : Error };
export type Result_4 = { 'Ok' : null } |
  { 'Err' : Error };
export type Result_5 = { 'Ok' : [] | [InteractionResult] } |
  { 'Err' : Error };
export type Result_6 = { 'Ok' : AnimaMetrics } |
  { 'Err' : Error };
export type UserState = {
    'Initialized' : { 'name' : string, 'anima_id' : Principal }
  } |
  { 'NotInitialized' : null };
export interface _SERVICE {
  'check_autonomous_messages' : ActorMethod<[Principal], Result_5>,
  'check_initialization' : ActorMethod<[Principal], Result_5>,
  'create_anima' : ActorMethod<[string], Result_1>,
  'get_anima' : ActorMethod<[Principal], Result_2>,
  'get_anima_metrics' : ActorMethod<[Principal], Result_6>,
  'get_user_state' : ActorMethod<[[] | [Principal]], UserState>,
  'interact' : ActorMethod<[Principal, string], Result_3>,
  'set_openai_config' : ActorMethod<[string], Result_4>,
  'toggle_autonomous' : ActorMethod<[Principal, boolean], Result_5>,
}
