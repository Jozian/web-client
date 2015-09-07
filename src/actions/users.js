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

export function loadUser(id) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.USER_LOADING, types.USER_LOADED, types.USER_LOAD_ERROR],
      promise: usersApi.getItem(id),
    },
  };
}

export function isUnique(body) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.USER_CHECKING_UNIQUE, types.USER_CHECKED_UNIQUE, types.USER_CHECK_UNIQUE_ERROR],
      promise: usersApi.isUnique(body),
    },
  };
}

export function editUser(id, body) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.USER_LOADING, types.USER_LOADED, types.USER_LOAD_ERROR],
      promise: usersApi.edit(id, body),
    },
  };
}export function deleteUsers(ids) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.USERS_DELETING, types.USERS_DELETED, types.USERS_DELETE_ERROR],
      promise: usersApi.deleteUsers(ids),
    },
  };
}
export function uploadUsers(formData) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.USERS_UPLOADING, types.USERS_UPLOADED, types.USERS_UPLOAD_ERROR],
      promise: usersApi.uploadFile(formData),
    },
  };
}
