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
  const SetAssetContentArguments = IDL.Record({
    'key' : Key,
    'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'chunk_ids' : IDL.Vec(ChunkId),
    'content_encoding' : IDL.Text,
  });
  const BatchOperationKind = IDL.Variant({
    'CreateAsset' : CreateAssetArguments,
    'UnsetAssetContent' : IDL.Record({ 'key' : Key }),
    'DeleteAsset' : IDL.Record({ 'key' : Key }),
    'SetAssetContent' : SetAssetContentArguments,
    'Clear' : IDL.Record({}),
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const Time = IDL.Int;
  return IDL.Service({
    'authorize' : IDL.Func([IDL.Principal], [], []),
    'clear' : IDL.Func([], [], []),
    'commit_batch' : IDL.Func(
        [
          IDL.Record({
            'batch_id' : BatchId,
            'operations' : IDL.Vec(BatchOperationKind),
          }),
        ],
        [],
        [],
      ),
    'create_asset' : IDL.Func([CreateAssetArguments], [], []),
    'create_batch' : IDL.Func([], [BatchId], []),
    'create_chunk' : IDL.Func(
        [IDL.Record({ 'content' : IDL.Vec(IDL.Nat8), 'batch_id' : BatchId })],
        [ChunkId],
        [],
      ),
    'delete_asset' : IDL.Func([Key], [], []),
    'get' : IDL.Func(
        [IDL.Record({ 'key' : Key, 'accept_encodings' : IDL.Vec(IDL.Text) })],
        [
          IDL.Record({
            'content' : IDL.Vec(IDL.Nat8),
            'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
            'content_type' : IDL.Text,
            'content_encoding' : IDL.Text,
            'total_length' : IDL.Nat,
          }),
        ],
        ['query'],
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
        ['query'],
      ),
    'http_request' : IDL.Func(
        [
          IDL.Record({
            'url' : IDL.Text,
            'method' : IDL.Text,
            'body' : IDL.Vec(IDL.Nat8),
            'headers' : IDL.Vec(HeaderField),
          }),
        ],
        [
          IDL.Record({
            'body' : IDL.Vec(IDL.Nat8),
            'headers' : IDL.Vec(HeaderField),
            'streaming_strategy' : IDL.Opt(
              IDL.Variant({
                'Callback' : IDL.Record({
                  'token' : IDL.Record({
                    'key' : Key,
                    'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
                    'index' : IDL.Nat,
                    'content_encoding' : IDL.Text,
                  }),
                  'callback' : IDL.Func(
                      [
                        IDL.Record({
                          'key' : Key,
                          'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
                          'index' : IDL.Nat,
                          'content_encoding' : IDL.Text,
                        }),
                      ],
                      [IDL.Record({ 'content' : IDL.Vec(IDL.Nat8) })],
                      ['query'],
                    ),
                }),
              })
            ),
            'status_code' : IDL.Nat16,
          }),
        ],
        ['query'],
      ),
    'http_request_streaming_callback' : IDL.Func(
        [
          IDL.Record({
            'key' : Key,
            'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
            'index' : IDL.Nat,
            'content_encoding' : IDL.Text,
          }),
        ],
        [IDL.Record({ 'content' : IDL.Vec(IDL.Nat8) })],
        ['query'],
      ),
    'list' : IDL.Func(
        [],
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
    'set_asset_content' : IDL.Func([SetAssetContentArguments], [], []),
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
    'unset_asset_content' : IDL.Func([Key], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
