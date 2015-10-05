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

export function deleteLibraries(ids) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.LIBRARIES_DELETING, types.LIBRARIES_DELETED, types.LIBRARY_DELETE_ERROR],
      promise: librariesApi.deleteLibraries(ids),
    },
  };
}

export function inviteUsers(body) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.INVITED_USERS_UPDATING, types.INVITED_USERS_UPDATED, types.INVITED_USERS_UPDATE_ERROR],
      promise: librariesApi.inviteUsers(body),
    },
  };
}
