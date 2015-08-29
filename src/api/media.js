import fetch from './helper';

const apiUrl = '/api/media';

export function getList() {
  return fetch(apiUrl);
}

export function getItem(id) {
  if (!id || typeof id  !== 'string') {
    return Promise.reject('Invalid mediaId');
  }

  return fetch(apiUrl + '/' + id);
}

