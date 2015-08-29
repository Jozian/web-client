import * as types from '../actions/types.js';

import libraries from './libraries.js';
export { libraries };

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
export function statistics(state = {top5Downloads: [], top5Views: []}, action) {
  if (action.type !== types.STATISTICS_LOADED) {
    return state;
  }
  return {
    top5Downloads: action.payload[0].map((item) => {
      const prefix = 'http://www.microsofteducationdelivery.net';
      item.picture = prefix  + item.picture;
      return item;
    }),
    top5Views: action.payload[1].map((item) => {
      const prefix = 'http://www.microsofteducationdelivery.net';
      item.picture = prefix  + item.picture;
      return item;
    }),
  };
}
