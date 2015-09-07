import {combineReducers } from 'redux';

import * as types from '../actions/types.js';
import { handleLoadingChain, handlePendingChain } from './helpers';
import toastReducer from './toasts';

export const pendingToasts = toastReducer;

export const libraries = handleLoadingChain([
  types.LIBRARIES_LOADING,
  types.LIBRARIES_LOADED,
  types.LIBRARIES_LOAD_ERROR,
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

export const activeFolder = handleLoadingChain([
  types.FOLDER_LOADING,
  types.FOLDER_LOADED,
  types.FOLDER_LOAD_ERROR,
], 'entity', {});

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
