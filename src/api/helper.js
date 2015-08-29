import isomorphicFetch from 'isomorphic-fetch';

const baseUrl = 'http://www.microsofteducationdelivery.net';

function getAuthHeader() {
  return 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiaXNzdWVUaW1lIjoxNDQwODM4MjA3MjM1LCJpYXQiOjE0NDA4MzgyMDcsImV4cCI6MTQ0NjAyMjIwN30.GwAECbCz_qEEUIBO8ZktNZa540KO27Idk-3FuXN6Bhw';
}


function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export default function fetch(url, options = {}) {
  const customHeaders = {
    headers: {
      Authorization: getAuthHeader(),
      'Content-Type': 'application/json',
    },
  };

  return isomorphicFetch(baseUrl + url, {...options, ...customHeaders})
    .then(checkStatus)
    .then((response) => response.status === 204 ? undefined : response.json())
  ;
}

