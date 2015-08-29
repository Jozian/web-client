import fetch from './helper';

const apiUrl = '/api/users';
const isUniqueUrl = '/api/isUnique';

export function getList() {
  return fetch(apiUrl);
}

export function getItem(id) {
  if (!id || typeof id  !== 'string') {
    return Promise.reject('Invalid UserId');
  }

  return fetch(apiUrl + '/' + id);
}

export function add(body) {
  if (!body || !body.name || !body.login || !body.password || !body.type) {
    return Promise.reject('Invalid body');
  }

  return fetch(apiUrl, {
    method: 'post',
    body: JSON.stringify(body),
  });
}

export function edit(id, body) {
  if (!body || !body.name || !body.login || !body.password || !body.type) {
    return Promise.reject('Invalid body');
  }

  if (!id || typeof id  !== 'string') {
    return Promise.reject('Invalid UserId');
  }

  return fetch(apiUrl + '/' + id, {
    method: 'put',
    body: JSON.stringify(body),
  });
}

export function remove(body) {
  // body is an array of ids
  if (!body || !body instanceof Array) {
    return Promise.reject('Invalid body');
  }

  return fetch(apiUrl, {
    method: 'delete',
    body: JSON.stringify(body),
  });
}

export function isUnique(body) {
  if (!body || !body.key || !body.value ) {
    return Promise.reject('Invalid body');
  }

  return fetch(isUniqueUrl, {
    method: 'post',
    body: JSON.stringify(body),
  });
}

