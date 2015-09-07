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
