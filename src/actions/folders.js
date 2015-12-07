import * as api from '../api/folders.js';
import * as types from '../actions/types';
import * as apiUsers from '../api/users.js';

export function loadFoldersList(id) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.FOLDER_LOADING, types.FOLDER_LOADED, types.FOLDER_LOAD_ERROR],
      promise: api.getFolderList(id),
    },
  };
}

export function createFolder(newData) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.FOLDER_CREATING, types.FOLDER_CREATED, types.FOLDER_CREATION_ERROR],
      promise: api.addFolder(newData),
    },
  };
}

export function updateFolder(data) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.FOLDER_UPDATING, types.FOLDER_UPDATED, types.FOLDER_UPDATE_ERROR],
      promise: api.editFolder(data.id, data.name),
    },
  };
}

export function loadFolder(id) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.FOLDER_ID_LOADING, types.FOLDER_ID_LOADED, types.FOLDER_ID_ERROR],
      promise: api.getFolder(id),
    },
  };
}

export function deleteFolders(data) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.FOLDER_DELETING, types.FOLDER_DELETED, types.FOLDER_DELETE_ERROR],
      promise: api.deleteFolders(data),
    },
  };
}

export function uploadMedia(data) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.MEDIA_TO_FOLDER_ADDING, types.MEDIA_TO_FOLDER_ADDED, types.ADD_MEDIA_TO_FOLDER_ERROR],
      promise: api.addMediaToFolder(data),
    },
  };
}

export function setDontAsk() {
  return {
    type: types.DONT_ASK_AGAIN,
    promise: apiUsers.dontAskUser(),
  };
}