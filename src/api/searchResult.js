import fetch from './helper';

const apiUrl = '/api/searchManagement/search';

export function getSearchResult(searchString) {
  if (!searchString || typeof searchString !== 'string') {
    return Promise.reject('Invalid search string');
  }
  return fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(searchString),
  });
}

