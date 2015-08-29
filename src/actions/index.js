import * as librariesApi from '../api/libraries';
import * as types from '../actions/types';

export function loadLibraries() {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.LIBRARIES_LOADING, types.LIBRARIES_LOADED, types.LIBRARIES_LOAD_ERROR],
      promise: librariesApi.getLibrariesList(),
    },
  };
}
