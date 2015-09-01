const initialState = {
  loading: false,
  entities: [],
  error: null,
};

const handleLoadingChain = (types, field = 'entities', defaultValue = []) =>
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

export {handleLoadingChain};
