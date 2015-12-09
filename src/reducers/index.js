import {combineReducers } from 'redux';

import * as types from '../actions/types.js';
import { handleLoadingChain, handlePendingChain } from './helpers';
import toastReducer from './toasts';
import editUser from './editUser';
import activeFolderReducer from './activeFolder';

import activeCommentDetailReducer from './activeCommentDetail';
import activeSearchResultReducer from './activeSearchResult';

export const pendingToasts = toastReducer;
export const activeFolder = activeFolderReducer;
export const activeComment = activeCommentDetailReducer;
export const searchResult = activeSearchResultReducer;

export const libraries = handleLoadingChain([
  types.LIBRARIES_LOADING,
  types.LIBRARIES_LOADED,
  types.LIBRARIES_LOAD_ERROR,
]);

export const media = handleLoadingChain([
  types.MEDIA_LIST_LOADING,
  types.MEDIA_LIST_LOADED,
  types.MEDIA_LIST_LOAD_ERROR,
]);

export const statistics = handleLoadingChain([
  types.STATISTICS_LOADING,
  types.STATISTICS_LOADED,
  types.STATISTICS_LOAD_ERROR,
]);
export const comments = handleLoadingChain([
  types.COMMENTS_LOADING,
  types.COMMENTS_LOADED,
  types.COMMENTS_LOAD_ERROR,
]);

export const users = handleLoadingChain([
  types.USERS_LOADING,
  types.USERS_LOADED,
  types.USERS_LOAD_ERROR,
]);

export const folder = handleLoadingChain([
  types.FOLDER_ID_LOADING,
  types.FOLDER_ID_LOADED,
  types.FOLDER_ID_ERROR,
]);

export const activeMedia = handleLoadingChain([
  types.MEDIA_LOADING,
  types.MEDIA_LOADED,
  types.MEDIA_LOAD_ERROR,
]);


export const user = (state, action) => {
  const loadingReducer = handleLoadingChain([
    types.USER_LOADING,
    types.USER_LOADED,
    types.USER_LOAD_ERROR,
  ], 'entity', {});

  const newState = loadingReducer(state, action);
  if (state !== newState) {
    return newState;
  } else {
    return editUser(state, action);
  }
}

export const motd = handleLoadingChain([
  types.MOTD_LOADING,
  types.MOTD_LOADED,
  types.MOTD_LOAD_ERROR,
], 'entity', {});

export const usersTemplate  = handleLoadingChain([
  types.USERS_TEMPLATE_UPLOADING,
  types.USERS_TEMPLATE_UPLOADED,
  types.USERS_TEMPLATE_ERROR,
]);

export const pendingActions = combineReducers({
  newLibrary: handlePendingChain(
    [types.LIBRARY_CREATING],
    [types.LIBRARY_CREATED, types.LIBRARY_CREATION_ERROR],
  ),
  deleteLibraries: handlePendingChain(
    [types.LIBRARIES_DELETING],
    [types.LIBRARIES_DELETED, types.LIBRARIES_DELETED],
  ),
  newComment: handlePendingChain(
    [types.COMMENT_CREATING],
    [types.COMMENT_CREATED, types.COMMENT_CREATING_ERROR],
  ),
  updateComments: handlePendingChain(
    [types.COMMENTS_UPDATING],
    [types.COMMENTS_UPDATED, types.COMMENTS_UPDATE_ERROR],
  ),
  deleteComments: handlePendingChain(
    [types.COMMENTS_DELETING],
    [types.COMMENTS_DELETED, types.COMMENTS_DELETE_ERROR]
  ),
  updateMotd: handlePendingChain(
    [types.MOTD_UPDATING],
    [types.MOTD_UPDATED, types.MOTD_UPDATE_ERROR],
  ),
  statisticsExport: handlePendingChain(
    [types.STATISTICS_EXPORTING],
    [types.STATISTICS_EXPORTED, types.STATISTICS_EXPORT_ERROR],
  ),
  commentsExport: handlePendingChain(
    [types.COMMENTS_EXPORTING],
    [types.COMMENTS_EXPORTED, types.COMMENTS_EXPORT_ERROR],
  ),
  deleteUsers: handlePendingChain(
    [types.USERS_DELETING],
    [types.USERS_DELETED, types.USERS_DELETE_ERROR],
  ),
  uploadUsers: handlePendingChain(
    [types.USERS_UPLOADING],
    [types.USERS_UPLOADED, types.USERS_UPLOAD_ERROR],
  ),
  inviteUsers: handlePendingChain(
    [types.INVITED_USERS_UPDATING],
    [types.INVITED_USERS_UPDATED, types.INVITED_USERS_UPDATE_ERROR],
  ),
  createFolder: handlePendingChain(
    [types.FOLDER_CREATING],
    [types.FOLDER_CREATED, types.FOLDER_LOAD_ERROR],
  ),
  updateFolder: handlePendingChain(
    [types.FOLDER_UPDATING],
    [types.FOLDER_UPDATED, types.FOLDER_UPDATE_ERROR],
  ),
  updateMedia: handlePendingChain(
    [types.MEDIA_UPDATING],
    [types.MEDIA_LOADED, types.MEDIA_LOAD_ERROR],
  ),
  addMedia: handlePendingChain(
    [types.MEDIA_TO_FOLDER_ADDING],
    [types.MEDIA_TO_FOLDER_ADDED, types.ADD_MEDIA_TO_FOLDER_ERROR],
  ),
});

export function errorApplication(state, action) {
  if (action.type === types.APPLICATION_ERROR) {
    if (state) {
      state.error = true;
    } else {
      state = {error: true};
    }
  }
  return state ? state : {};
}

export function currentUser(state, action) {
  const user = JSON.parse(localStorage.getItem('MEDuser'));
  const token = localStorage.getItem('MEDtoken');
  if (action.type === types.LOGOUT_USER || !user || !token) {
    return {};
  }

  if (!state) {

    if (!user) {
      throw new Error('Missing user in localStorage');
    }

    if (!token) {
      throw new Error('Missing token in localStorage');
    }

    return {...user, token};
  }

  return state;
}
