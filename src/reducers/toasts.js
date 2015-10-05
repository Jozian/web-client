import * as types from '../actions/types.js';

const messages = {
  [types.MOTD_UPDATED]: {
    text: 'MOTD successfully updated',
    type: 'success',
  },
  [types.LIBRARY_CREATED]: {
    text: 'Library successfully created',
    type: 'success',
  },
  [types.LIBRARIES_DELETED]: {
    text: 'Libraries successfully removed',
    type: 'success',
  },
  [types.STATISTICS_EXPORTED]: {
    text: 'Statistics successfully exported',
    type: 'success',
  },

  [types.COMMENTS_EXPORTED]: {
    text: 'Comments exported successfully',
    type: 'success',
  },

  [types.COMMENTS_EXPORT_ERROR]: {
    text: 'Error exporting comments',
    type: 'error',
  },

  [types.USERS_DELETED]: {
    text: 'Users successfully removed',
    type: 'success',
  },
  [types.USERS_UPLOADED]: {
    text: 'Users successfully uploded',
    type: 'success',
  },
  [types.USERS_UPLOAD_ERROR]: {
    text: 'Error uploading users',
    type: 'error',
  },
  [types.INVITED_USERS_UPDATED]: {
    text: 'Invited users successfully updated',
    type: 'success',
  },
  [types.INVITED_USERS_UPDATE_ERROR]: {
    text: 'Error invited users update',
    type: 'error',
  },
};

export default function toastReducer(state = [], action) {
  if (action.type === types.REMOVE_PENDING_TOAST) {
    const index = state.indexOf(action.payload);
    const newState = [...state];
    newState.splice(index, 1);
    return newState;
  }

  return messages[action.type] ? [...state, messages[action.type]] : state;
}
