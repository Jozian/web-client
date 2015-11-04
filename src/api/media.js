import fetch from './helper';

const apiUrl = '/api/media';
const mediaManagement = '/api/mediaManagement';

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

export function uploadPrevImage(id, body) {
  if (!body || !(body instanceof FormData)) {
    return Promise.reject('Invalid body');
  }

  return fetch(mediaManagement + '/changeImage?media=' + id, {
    method: 'post',
    body: body,
    responseType: 'text',
  });
}

export function changePrevImage(name, fileChange) {
  if (!name || !fileChange) {
    return Promise.reject('Invalid body');
  }

  return fetch(mediaManagement + '/copyImage?name=' + name + '&fileChange=' + fileChange);
}
