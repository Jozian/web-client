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
