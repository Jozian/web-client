const initialState = {
  loading: false,
  entities: [],
  error: null,
};

export const handleLoadingChain = (types, field = 'entities', defaultValue = []) =>
  function handleState(state = initialState, action) {
    if (types.length !== 3) {
      throw new Error('There should be exactly 3 events in series');
    }
    const [loading, loaded, error] = types;

    switch (action.type) {
    case loading:
      return { ...state, loading: true, error: null };
    case loaded:
      return { ...state, loading: false, [field]: action.payload, error: null };
    case error:
      return { ...state, loading: false, [field]: defaultValue, error: action.payload };
    default:
      return state;
    }
  };

export const combineChains = (defaultState, ...chains) => (state, action) => {
  if (state === undefined) {
    return defaultState;
  }
  const newStates = chains.map(fn => fn(state, action)).filter((newState) => newState !== state);
  if (newStates.length > 1) {
    throw new Error('Multiple handlers reacted on state change in combine chains. That should not happen');
  }

  return newStates.length ? newStates[0] : state;
};
