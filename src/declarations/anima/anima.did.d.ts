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
export type DevelopmentalStage = { 'Beginner' : null } |
  { 'Advanced' : null } |
  { 'Initial' : null } |
  { 'Intermediate' : null } |
  { 'Expert' : null };
export type Error = { 'Configuration' : string } |
  { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'External' : string };
export type EventType = { 'LearningMoment' : null } |
  { 'AutonomousThought' : null } |
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
  'timestamp' : bigint,
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
export interface _SERVICE {
  'check_autonomous_messages' : ActorMethod<
    [Principal],
    { 'Ok' : [] | [InteractionResult] } |
      { 'Err' : Error }
  >,
  'create_anima' : ActorMethod<
    [string],
    { 'Ok' : Principal } |
      { 'Err' : Error }
  >,
  'get_anima' : ActorMethod<[Principal], { 'Ok' : Anima } | { 'Err' : Error }>,
  'interact' : ActorMethod<
    [Principal, string],
    { 'Ok' : InteractionResult } |
      { 'Err' : Error }
  >,
  'set_openai_api_key' : ActorMethod<
    [string],
    { 'Ok' : null } |
      { 'Err' : Error }
  >,
}
