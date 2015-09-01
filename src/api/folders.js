import fetch from './helper';

const apiUrl = '/api/folders';

export function getFolderList(id) {
  if (!id || typeof id  !== 'string') {
    return Promise.reject('Invalid libraryId');
  }

  return fetch(`${apiUrl}/${id}`);
}

export function addFolder(body) {
  if (!body || !body.name || !body.parentId) {
    return Promise.reject('Invalid body');
  }

  return fetch(apiUrl, {
    method: 'post',
    body: JSON.stringify(body),
  });
}

export function editFolder(id, body) {
  if (!body || !body.name) {
    return Promise.reject('Invalid body');
  }

  if (!folderId || typeof folderId  !== 'string') {
    return Promise.reject('Invalid folderId');
  }

  return fetch(`${apiUrl}/${id}`, {
    method: 'put',
    body: JSON.stringify(body),
  });
}
