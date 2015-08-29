import * as typeActions from './../actions/types';
import libraries from './libraries';


export {libraries};


export default function(state, action) {
  switch (action.type) {
  case typeActions.LIBRARIES_LOADING:
    return state;
  case typeActions.LIBRARIES_LOADED:
    console.log("action.payload",action.payload)
    return { ...state, ...{ libraries: action.payload } };
  case typeActions.LIBRARIES_LOADED:
    return state;
  default:
    return state;
  }
}