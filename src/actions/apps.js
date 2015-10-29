import * as types from '../actions/types';
import * as apiUsers from '../api/users.js';

export function logoutUser() {
  return {
    type: types.LOGOUT_USER,
    promise: apiUsers.userLogout(),
  };
}
