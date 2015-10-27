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

export function editFolder(folderId, name) {
  if (!name || typeof name  !== 'string') {
    return Promise.reject('Invalid body');
  }

  if (!folderId || typeof folderId  !== 'string') {
    return Promise.reject('Invalid folderId');
  }

  return fetch(`${apiUrl}/${folderId}`, {
    method: 'put',
    body: JSON.stringify({name: name}),
  });
}

export function getFolder(folderId) {
  if (!folderId || typeof folderId !== 'string') {
    return Promise.reject('Invalid folder id');
  }

  return fetch(apiUrl + '/' + folderId);
}

export function deleteFolders(body) {
  if (!body) {
    return Promise.reject();
  }

  return fetch('/api/contentActions/delete', {
    method: 'post',
    body: JSON.stringify(body),
  });
}