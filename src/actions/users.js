import * as usersApi from '../api/users.js';
import * as types from '../actions/types';

export function loadUsers() {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.USERS_LOADING, types.USERS_LOADED, types.USERS_LOAD_ERROR],
      promise: usersApi.getList(),
    },
  };
}

