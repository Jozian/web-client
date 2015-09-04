import * as types from '../actions/types.js';
import { handleLoadingChain } from './helpers';

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
