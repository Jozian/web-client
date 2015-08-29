import fetch from './helper';

const apiUrl = '/api/comments';
const exportUrl = '/api/commentsManagement/commentsExport';

export function getList(mediaId) {
  if (!mediaId || typeof mediaId  !== 'string') {
    return Promise.reject('Invalid mediaId');
  }

  return fetch(apiUrl + '/' + mediaId);
}

export function commentsExport() {
  return fetch(exportUrl);
}

export function add(body) {
  if (!body || !body.author || !body.id || !body.text) {
    return Promise.reject('Invalid body');
  }

  return fetch(apiUrl, {
    method: 'post',
    body: JSON.stringify(body),
  });
}

export function edit(commentId, body) {
  if (!body || !body.author || !body.id || !body.text) {
    return Promise.reject('Invalid body');
  }

  if (!commentId || typeof commentId  !== 'string') {
    return Promise.reject('Invalid commentId');
  }

  return fetch(apiUrl + '/' + commentId, {
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

