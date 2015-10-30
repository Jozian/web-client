import fetch from './helper';

const apiUrl = '/api/media';

export function getMediaList() {
  return fetch(apiUrl);
}

export function getItem(id) {
  if (!id || typeof id  !== 'string') {
    return Promise.reject('Invalid mediaId');
  }

  return fetch(apiUrl + '/' + id);
}

export function editMedia(id, body) {
  if (!body.name || typeof body.name !== 'string') {
    return Promise.reject('Invalid media name');
  }

  return fetch(apiUrl + '/' + id, {
    method: 'put',
    body: JSON.stringify(body),
  });
}
