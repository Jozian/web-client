import isomorphicFetch from 'isomorphic-fetch';
import store from '../store/configureStore';

const baseUrl = 'http://www.microsofteducationdelivery.net';

function getAuthHeader() {
  return 'Bearer ' + (store.getState().currentUser ? store.getState().currentUser.token : '');
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

