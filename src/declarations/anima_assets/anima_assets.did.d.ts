import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type BatchId = bigint;
export type ChunkId = bigint;
export interface CommitBatchArguments {
  'batch_id' : BatchId,
  'operations' : Array<Operation>,
}
export interface CreateAssetArguments {
  'key' : Key,
  'content_type' : string,
  'headers' : [] | [Array<[string, string]>],
  'max_age' : [] | [bigint],
}
export type Key = string;
export type Operation = { 'CreateAsset' : CreateAssetArguments } |
  { 'UnsetAssetContent' : { 'key' : Key, 'content_encoding' : string } } |
  { 'DeleteAsset' : { 'key' : Key } } |
  {
    'SetAssetContent' : {
      'key' : Key,
      'sha256' : [] | [Uint8Array | number[]],
      'chunk_ids' : Array<ChunkId>,
      'content_encoding' : string,
    }
  } |
  { 'Clear' : {} };
export type Time = bigint;
export interface _SERVICE {
  'commit_batch' : ActorMethod<[CommitBatchArguments], undefined>,
  'create_asset' : ActorMethod<[CreateAssetArguments], undefined>,
  'create_batch' : ActorMethod<[], { 'batch_id' : BatchId }>,
  'create_chunk' : ActorMethod<
    [{ 'content' : Uint8Array | number[], 'batch_id' : BatchId }],
    { 'chunk_id' : ChunkId }
  >,
  'delete_asset' : ActorMethod<[{ 'key' : Key }], undefined>,
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
        'headers' : Array<[string, string]>,
      },
    ],
    {
      'body' : Uint8Array | number[],
      'headers' : Array<[string, string]>,
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
        'token' : {
          'key' : Key,
          'sha256' : [] | [Uint8Array | number[]],
          'index' : bigint,
          'content_encoding' : string,
        },
      },
    ],
    {
      'token' : [] | [
        {
          'key' : Key,
          'sha256' : [] | [Uint8Array | number[]],
          'index' : bigint,
          'content_encoding' : string,
        }
      ],
      'body' : Uint8Array | number[],
    }
  >,
  'list' : ActorMethod<
    [{}],
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
  'set_asset_content' : ActorMethod<
    [
      {
        'key' : Key,
        'sha256' : [] | [Uint8Array | number[]],
        'chunk_ids' : Array<ChunkId>,
        'content_encoding' : string,
      },
    ],
    undefined
  >,
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
  'unset_asset_content' : ActorMethod<
    [{ 'key' : Key, 'content_encoding' : string }],
    undefined
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
