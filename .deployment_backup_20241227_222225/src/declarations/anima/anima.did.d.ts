import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AnimaNFT {
  'id' : TokenIdentifier,
  'creation_time' : bigint,
  'last_interaction' : bigint,
  'owner' : Principal,
  'name' : string,
  'autonomous_enabled' : boolean,
}
export interface Listing {
  'token_id' : TokenIdentifier,
  'created_at' : bigint,
  'seller' : Principal,
  'price' : bigint,
  'expires_at' : [] | [bigint],
}
export interface Offer {
  'token_id' : TokenIdentifier,
  'created_at' : bigint,
  'buyer' : Principal,
  'price' : bigint,
  'expires_at' : bigint,
}
export type TokenIdentifier = bigint;
export interface TokenMetadata {
  'name' : string,
  'description' : [] | [string],
  'attributes' : Array<{ 'trait_type' : string, 'value' : string }>,
}
export interface _SERVICE {
  'create_anima' : ActorMethod<
    [string],
    { 'Ok' : Principal } |
      { 'Err' : string }
  >,
  'get_marketplace_listings' : ActorMethod<
    [],
    Array<[TokenIdentifier, bigint]>
  >,
  'get_user_animas' : ActorMethod<[], Array<AnimaNFT>>,
  'list_token' : ActorMethod<
    [TokenIdentifier, bigint, [] | [bigint]],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
