import * as typeActions from './../actions/types';

export default function(state = [], action) {
  switch (action.type) {
  case typeActions.LIBRARIES_LOADED:
    return { ...action.payload };
  case typeActions.LIBRARIES_LOADING:
  case typeActions.LIBRARIES_LOAD_ERROR:
  default:
    return state;
  }
}
