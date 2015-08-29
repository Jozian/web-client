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
