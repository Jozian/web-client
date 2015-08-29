import * as typeActions from './../actions/types';

export default function(state = [], action) {
  switch (action.type) {
  case typeActions.LIBRARIES_LOADED:
    return { loading: false, entities: action.payload, error: null };
  case typeActions.LIBRARIES_LOADING:
    return { loading: true, entities: state.entities, error: null };
  case typeActions.LIBRARIES_LOAD_ERROR:
    return { loading: false, entities: [], error: action.payload };
  default:
    return state;
  }
}
