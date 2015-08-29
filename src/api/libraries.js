import fetch from './helper';

const apiUrl = '/api/libraries';

export function getLibrariesList() {
  return fetch(apiUrl);
}

export function addLibrary(body) {
  if (!body || !body.name) {
    return Promise.reject('Invalid body');
  }

  return fetch(apiUrl, {
    method: 'post',
    body: JSON.stringify(body),
  });
}

export function deleteLibrary(body) {
  // body is an array of ids
  if (!body || !body instanceof Array) {
    return Promise.reject('Invalid body');
  }

  return fetch(apiUrl, {
    method: 'delete',
    body: JSON.stringify(body),
  });
}
