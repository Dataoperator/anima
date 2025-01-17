import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type BatchId = bigint;
export type BatchOperationKind = { 'CreateAsset' : CreateAssetArguments } |
  { 'UnsetAssetContent' : { 'key' : Key } } |
  { 'DeleteAsset' : { 'key' : Key } } |
  { 'SetAssetContent' : SetAssetContentArguments } |
  { 'Clear' : {} };
export type ChunkId = bigint;
export interface CreateAssetArguments {
  'key' : Key,
  'content_type' : string,
  'headers' : [] | [Array<[string, string]>],
  'max_age' : [] | [bigint],
}
export type HeaderField = [string, string];
export type Key = string;
export interface SetAssetContentArguments {
  'key' : Key,
  'sha256' : [] | [Uint8Array | number[]],
  'chunk_ids' : Array<ChunkId>,
  'content_encoding' : string,
}
export type Time = bigint;
export interface _SERVICE {
  'authorize' : ActorMethod<[Principal], undefined>,
  'clear' : ActorMethod<[], undefined>,
  'commit_batch' : ActorMethod<
    [{ 'batch_id' : BatchId, 'operations' : Array<BatchOperationKind> }],
    undefined
  >,
  'create_asset' : ActorMethod<[CreateAssetArguments], undefined>,
  'create_batch' : ActorMethod<[], BatchId>,
  'create_chunk' : ActorMethod<
    [{ 'content' : Uint8Array | number[], 'batch_id' : BatchId }],
    ChunkId
  >,
  'delete_asset' : ActorMethod<[Key], undefined>,
  'get' : ActorMethod<
    [{ 'key' : Key, 'accept_encodings' : Array<string> }],
    {
      'content' : Uint8Array | number[],
      'sha256' : [] | [Uint8Array | number[]],
      'content_type' : string,
      'content_encoding' : string,
      'total_length' : bigint,
    }
  >,
  'get_chunk' : ActorMethod<
    [
      {
        'key' : Key,
        'sha256' : [] | [Uint8Array | number[]],
        'index' : bigint,
        'content_encoding' : string,
      },
    ],
    { 'content' : Uint8Array | number[] }
  >,
  'http_request' : ActorMethod<
    [
      {
        'url' : string,
        'method' : string,
        'body' : Uint8Array | number[],
        'headers' : Array<HeaderField>,
      },
    ],
    {
      'body' : Uint8Array | number[],
      'headers' : Array<HeaderField>,
      'streaming_strategy' : [] | [
        {
            'Callback' : {
              'token' : {
                'key' : Key,
                'sha256' : [] | [Uint8Array | number[]],
                'index' : bigint,
                'content_encoding' : string,
              },
              'callback' : [Principal, string],
            }
          }
      ],
      'status_code' : number,
    }
  >,
  'http_request_streaming_callback' : ActorMethod<
    [
      {
        'key' : Key,
        'sha256' : [] | [Uint8Array | number[]],
        'index' : bigint,
        'content_encoding' : string,
      },
    ],
    { 'content' : Uint8Array | number[] }
  >,
  'list' : ActorMethod<
    [],
    Array<
      {
        'key' : Key,
        'encodings' : Array<
          {
            'modified' : Time,
            'sha256' : [] | [Uint8Array | number[]],
            'length' : bigint,
            'content_encoding' : string,
          }
        >,
        'content_type' : string,
      }
    >
  >,
  'set_asset_content' : ActorMethod<[SetAssetContentArguments], undefined>,
  'store' : ActorMethod<
    [
      {
        'key' : Key,
        'content' : Uint8Array | number[],
        'sha256' : [] | [Uint8Array | number[]],
        'content_type' : string,
        'content_encoding' : string,
      },
    ],
    undefined
  >,
  'unset_asset_content' : ActorMethod<[Key], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
