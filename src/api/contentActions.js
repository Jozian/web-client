import fetch from './helper';

const apiUrl = '/api/contentActions';

export function contentActionDelete(libraryId) {
  if (!libraryId || typeof libraryId  !== 'string') {
    return Promise.reject('Invalid libraryId');
  }

  return fetch(apiUrl + '/' + libraryId);
}
