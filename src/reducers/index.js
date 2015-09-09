import {combineReducers } from 'redux';

import * as types from '../actions/types.js';
import { handleLoadingChain, handlePendingChain } from './helpers';
import toastReducer from './toasts';
import activeFolderReducer from './activeFolder';

export const pendingToasts = toastReducer;
export const activeFolder = activeFolderReducer;

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

export const users = handleLoadingChain([
  types.USERS_LOADING,
  types.USERS_LOADED,
  types.USERS_LOAD_ERROR,
]);

export const motd = handleLoadingChain([
  types.MOTD_LOADING,
  types.MOTD_LOADED,
  types.MOTD_LOAD_ERROR,
], 'entity', {});

export const pendingActions = combineReducers({
  newLibrary: handlePendingChain(
    [types.LIBRARY_CREATING],
    [types.LIBRARY_CREATED, types.LIBRARY_CREATION_ERROR],
  ),
  deleteLibraries: handlePendingChain(
    [types.LIBRARIES_DELETING],
    [types.LIBRARIES_DELETED, types.LIBRARIES_DELETED],
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
});

export function currentUser(state) {
  if (!state) {
    const user = JSON.parse(localStorage.getItem('MEDuser'));
    if (!user) {
      throw new Error('Missing user in localStorage');
    }
    const token = localStorage.getItem('MEDtoken');

    if (!token) {
      throw new Error('Missing token in localStorage');
    }

    return {...user, token};
  }

  return state;
}
