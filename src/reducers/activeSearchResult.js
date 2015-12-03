import * as types from 'actions/types';
const defaultState = {
  loading: false,
  entities: {
    data: {
      media: [],
      users: [],
    },
  },
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
  case types.SEARCH_RESULT_LOADING:
    return { ...state, loading: true, error: null };
  case types.SEARCH_RESULT_LOADED:
    const newEntity = {...action.payload};
    newEntity.users = action.payload.users;
    newEntity.media = action.payload.media;
    return { ...state, loading: false, entities: newEntity, error: null };
  case types.SEARCH_RESULT_ERROR:
    return { ...state, loading: false, error: action.payload };
  default:
    return state;
  }
}
