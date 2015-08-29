import fetch from './helper';

const apiUrl = '/api/folders';

export function getFolderList(libraryId) {
  if (!libraryId || typeof libraryId  !== 'string') {
    return Promise.reject('Invalid libraryId');
  }

  return fetch(apiUrl + '/' + libraryId);
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

export function editFolder(folderId, body) {
  if (!body || !body.name) {
    return Promise.reject('Invalid body');
  }

  if (!folderId || typeof folderId  !== 'string') {
    return Promise.reject('Invalid folderId');
  }

  return fetch(apiUrl + '/' + folderId, {
    method: 'put',
    body: JSON.stringify(body),
  });
}


