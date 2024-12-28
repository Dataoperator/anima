export const idlFactory = ({ IDL }) => {
  const TokenIdentifier = IDL.Nat64;
  const AnimaNFT = IDL.Record({
    'id' : TokenIdentifier,
    'creation_time' : IDL.Nat64,
    'last_interaction' : IDL.Nat64,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'autonomous_enabled' : IDL.Bool,
  });
  return IDL.Service({
    'create_anima' : IDL.Func(
        [IDL.Text],
        [IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : IDL.Text })],
        [],
      ),
    'get_marketplace_listings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIdentifier, IDL.Nat64))],
        ['query'],
      ),
    'get_user_animas' : IDL.Func([], [IDL.Vec(AnimaNFT)], ['query']),
    'list_token' : IDL.Func(
        [TokenIdentifier, IDL.Nat64, IDL.Opt(IDL.Nat64)],
        [IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text })],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
