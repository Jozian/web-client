import fetch from './helper';

const apiUrl = '/api/searchManagement/search';

export function getSearchResult(data) {
  return fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

