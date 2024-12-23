export const idlFactory = ({ IDL }) => {
  const EventType = IDL.Variant({
    'LearningMoment' : IDL.Null,
    'AutonomousThought' : IDL.Null,
    'Initial' : IDL.Null,
    'EmotionalResponse' : IDL.Null,
    'UserInteraction' : IDL.Null,
    'RelationshipDevelopment' : IDL.Null,
  });
  const Memory = IDL.Record({
    'emotional_impact' : IDL.Float32,
    'description' : IDL.Text,
    'keywords' : IDL.Vec(IDL.Text),
    'timestamp' : IDL.Nat64,
    'importance_score' : IDL.Float32,
    'event_type' : EventType,
  });
  const InteractionResult = IDL.Record({
    'memory' : Memory,
    'personality_updates' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float32)),
    'is_autonomous' : IDL.Bool,
    'response' : IDL.Text,
  });
  const Error = IDL.Variant({
    'Configuration' : IDL.Text,
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'AlreadyInitialized' : IDL.Null,
    'External' : IDL.Text,
  });
  const Result_5 = IDL.Variant({
    'Ok' : IDL.Opt(InteractionResult),
    'Err' : Error,
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : Error });
  const DevelopmentalStage = IDL.Variant({
    'Beginner' : IDL.Null,
    'Advanced' : IDL.Null,
    'Initial' : IDL.Null,
    'Intermediate' : IDL.Null,
    'Expert' : IDL.Null,
  });
  const NFTPersonality = IDL.Record({
    'creation_time' : IDL.Nat64,
    'interaction_count' : IDL.Nat64,
    'hash' : IDL.Opt(IDL.Text),
    'traits' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float32)),
    'growth_level' : IDL.Nat32,
    'memories' : IDL.Vec(Memory),
    'developmental_stage' : DevelopmentalStage,
  });
  const Anima = IDL.Record({
    'creation_time' : IDL.Nat64,
    'personality' : NFTPersonality,
    'last_interaction' : IDL.Nat64,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'autonomous_enabled' : IDL.Bool,
  });
  const Result_2 = IDL.Variant({ 'Ok' : Anima, 'Err' : Error });
  const DevelopmentMetrics = IDL.Record({
    'emotional_maturity' : IDL.Float32,
    'learning_curve' : IDL.Float32,
    'trait_stability' : IDL.Float32,
    'growth_rate' : IDL.Float32,
  });
  const AnimaMetrics = IDL.Record({
    'total_memories' : IDL.Nat64,
    'interaction_frequency' : IDL.Float32,
    'avg_emotional_impact' : IDL.Float32,
    'autonomous_ratio' : IDL.Float32,
    'personality_development' : DevelopmentMetrics,
    'avg_importance_score' : IDL.Float32,
  });
  const Result_6 = IDL.Variant({ 'Ok' : AnimaMetrics, 'Err' : Error });
  const UserState = IDL.Variant({
    'Initialized' : IDL.Record({
      'name' : IDL.Text,
      'anima_id' : IDL.Principal,
    }),
    'NotInitialized' : IDL.Null,
  });
  const Result_3 = IDL.Variant({ 'Ok' : InteractionResult, 'Err' : Error });
  const Result_4 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : Error });
  return IDL.Service({
    'check_autonomous_messages' : IDL.Func([IDL.Principal], [Result_5], []),
    'check_initialization' : IDL.Func([IDL.Principal], [Result_5], ['query']),
    'create_anima' : IDL.Func([IDL.Text], [Result_1], []),
    'get_anima' : IDL.Func([IDL.Principal], [Result_2], ['query']),
    'get_anima_metrics' : IDL.Func([IDL.Principal], [Result_6], ['query']),
    'get_user_state' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [UserState],
        ['query'],
      ),
    'interact' : IDL.Func([IDL.Principal, IDL.Text], [Result_3], []),
    'set_openai_config' : IDL.Func([IDL.Text], [Result_4], []),
    'toggle_autonomous' : IDL.Func([IDL.Principal, IDL.Bool], [Result_5], []),
  });
};
export const init = ({ IDL }) => { return []; };
