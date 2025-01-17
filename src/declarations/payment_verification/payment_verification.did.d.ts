import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface PaymentSession {
  'status' : PaymentStatus,
  'session_id' : string,
  'token_id' : [] | [string],
  'owner' : Principal,
  'payment_address' : string,
  'amount' : bigint,
  'expires_at' : bigint,
}
export type PaymentStatus = { 'expired' : null } |
  { 'pending' : null } |
  { 'confirmed' : null } |
  { 'failed' : null };
export type Result = { 'Ok' : PaymentSession } |
  { 'Err' : string };
export interface _SERVICE {
  'cleanup_expired_sessions' : ActorMethod<[], undefined>,
  'complete_minting' : ActorMethod<[string, string], Result>,
  'create_payment_session' : ActorMethod<[Principal], Result>,
  'get_all_sessions' : ActorMethod<[], Array<PaymentSession>>,
  'get_session' : ActorMethod<[string], [] | [PaymentSession]>,
  'refund_session' : ActorMethod<[string], Result>,
  'verify_payment' : ActorMethod<[string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
