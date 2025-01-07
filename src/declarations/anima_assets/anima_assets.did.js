export const idlFactory = ({ IDL }) => {
  const BatchId = IDL.Nat;
  const Key = IDL.Text;
  const CreateAssetArguments = IDL.Record({
    'key' : Key,
    'content_type' : IDL.Text,
    'headers' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))),
    'max_age' : IDL.Opt(IDL.Nat64),
  });
  const ChunkId = IDL.Nat;
  const Operation = IDL.Variant({
    'CreateAsset' : CreateAssetArguments,
    'UnsetAssetContent' : IDL.Record({
      'key' : Key,
      'content_encoding' : IDL.Text,
    }),
    'DeleteAsset' : IDL.Record({ 'key' : Key }),
    'SetAssetContent' : IDL.Record({
      'key' : Key,
      'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'chunk_ids' : IDL.Vec(ChunkId),
      'content_encoding' : IDL.Text,
    }),
    'Clear' : IDL.Record({}),
  });
  const CommitBatchArguments = IDL.Record({
    'batch_id' : BatchId,
    'operations' : IDL.Vec(Operation),
  });
  const Time = IDL.Int;
  return IDL.Service({
    'commit_batch' : IDL.Func([CommitBatchArguments], [], []),
    'create_asset' : IDL.Func([CreateAssetArguments], [], []),
    'create_batch' : IDL.Func([], [IDL.Record({ 'batch_id' : BatchId })], []),
    'create_chunk' : IDL.Func(
        [IDL.Record({ 'content' : IDL.Vec(IDL.Nat8), 'batch_id' : BatchId })],
        [IDL.Record({ 'chunk_id' : ChunkId })],
        [],
      ),
    'delete_asset' : IDL.Func([IDL.Record({ 'key' : Key })], [], []),
    'get' : IDL.Func(
        [IDL.Record({ 'key' : Key, 'accept_encodings' : IDL.Vec(IDL.Text) })],
        [
          IDL.Record({
            'content' : IDL.Vec(IDL.Nat8),
            'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
            'content_type' : IDL.Text,
            'content_encoding' : IDL.Text,
            'total_length' : IDL.Nat64,
          }),
        ],
        [],
      ),
    'get_chunk' : IDL.Func(
        [
          IDL.Record({
            'key' : Key,
            'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
            'index' : IDL.Nat,
            'content_encoding' : IDL.Text,
          }),
        ],
        [IDL.Record({ 'content' : IDL.Vec(IDL.Nat8) })],
        [],
      ),
    'http_request' : IDL.Func(
        [
          IDL.Record({
            'url' : IDL.Text,
            'method' : IDL.Text,
            'body' : IDL.Vec(IDL.Nat8),
            'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
          }),
        ],
        [
          IDL.Record({
            'body' : IDL.Vec(IDL.Nat8),
            'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
            'streaming_strategy' : IDL.Opt(
              IDL.Variant({
                'Callback' : IDL.Record({
                  'token' : IDL.Record({
                    'key' : Key,
                    'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
                    'index' : IDL.Nat,
                    'content_encoding' : IDL.Text,
                  }),
                  'callback' : IDL.Func([], [], []),
                }),
              })
            ),
            'status_code' : IDL.Nat16,
          }),
        ],
        [],
      ),
    'http_request_streaming_callback' : IDL.Func(
        [
          IDL.Record({
            'token' : IDL.Record({
              'key' : Key,
              'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
              'index' : IDL.Nat,
              'content_encoding' : IDL.Text,
            }),
          }),
        ],
        [
          IDL.Record({
            'token' : IDL.Opt(
              IDL.Record({
                'key' : Key,
                'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
                'index' : IDL.Nat,
                'content_encoding' : IDL.Text,
              })
            ),
            'body' : IDL.Vec(IDL.Nat8),
          }),
        ],
        [],
      ),
    'list' : IDL.Func(
        [IDL.Record({})],
        [
          IDL.Vec(
            IDL.Record({
              'key' : Key,
              'encodings' : IDL.Vec(
                IDL.Record({
                  'modified' : Time,
                  'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
                  'length' : IDL.Nat,
                  'content_encoding' : IDL.Text,
                })
              ),
              'content_type' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'set_asset_content' : IDL.Func(
        [
          IDL.Record({
            'key' : Key,
            'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
            'chunk_ids' : IDL.Vec(ChunkId),
            'content_encoding' : IDL.Text,
          }),
        ],
        [],
        [],
      ),
    'store' : IDL.Func(
        [
          IDL.Record({
            'key' : Key,
            'content' : IDL.Vec(IDL.Nat8),
            'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
            'content_type' : IDL.Text,
            'content_encoding' : IDL.Text,
          }),
        ],
        [],
        [],
      ),
    'unset_asset_content' : IDL.Func(
        [IDL.Record({ 'key' : Key, 'content_encoding' : IDL.Text })],
        [],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
