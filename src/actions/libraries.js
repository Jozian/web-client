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

export function createLibrary(name) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.LIBRARY_CREATING, types.LIBRARY_CREATED, types.LIBRARY_CREATION_ERROR],
      promise: librariesApi.createLibrary(name),
    },
  };
}
