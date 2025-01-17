export const idlFactory = ({ IDL }) => {
  const PaymentStatus = IDL.Variant({
    'expired' : IDL.Null,
    'pending' : IDL.Null,
    'confirmed' : IDL.Null,
    'failed' : IDL.Null,
  });
  const PaymentSession = IDL.Record({
    'status' : PaymentStatus,
    'session_id' : IDL.Text,
    'token_id' : IDL.Opt(IDL.Text),
    'owner' : IDL.Principal,
    'payment_address' : IDL.Text,
    'amount' : IDL.Nat64,
    'expires_at' : IDL.Nat64,
  });
  const Result = IDL.Variant({ 'Ok' : PaymentSession, 'Err' : IDL.Text });
  return IDL.Service({
    'cleanup_expired_sessions' : IDL.Func([], [], []),
    'complete_minting' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'create_payment_session' : IDL.Func([IDL.Principal], [Result], []),
    'get_all_sessions' : IDL.Func([], [IDL.Vec(PaymentSession)], ['query']),
    'get_session' : IDL.Func([IDL.Text], [IDL.Opt(PaymentSession)], ['query']),
    'refund_session' : IDL.Func([IDL.Text], [Result], []),
    'verify_payment' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
