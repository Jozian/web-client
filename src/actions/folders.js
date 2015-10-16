import * as api from '../api/folders.js';
import * as types from '../actions/types';

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