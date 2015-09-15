import * as types from 'actions/types';
const defaultState = {
  loading: false,
  entity: {
    data: new WinJS.Binding.List([]),
  },
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
  case types.COMMENTS_LOADING:
    return { ...state, loading: true, error: null };
  case types.COMMENTS_LOADED:
    const newEntity = {...action.payload};
    newEntity.data = new WinJS.Binding.List(action.payload.data);
    return { ...state, loading: false, entity: newEntity, error: null };
  case types.COMMENTS_LOAD_ERROR:
    return { ...state, loading: false, error: action.payload };
  default:
    return state;
  }
}

