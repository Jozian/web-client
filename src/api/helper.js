import isomorphicFetch from 'isomorphic-fetch';
import store from '../store/configureStore';
import {stringify} from 'querystring';

// FIXME: ENV BASED BUILD
export const baseUrl = /*'http://medserver.apps.wookieelabs.com'*/ 'http://192.168.88.129:3010';

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

function addBust(url) {
  return [url, url.indexOf('?') === - 1 ? '?' : '&', stringify({bust: new Date().getTime()})].join('');
}

export default function fetch(url, options = {}) {
  const customHeaders = {
    headers: {
      Authorization: getAuthHeader(),
      Accept: 'application/json',
    },
  };
  if (!(options.body instanceof FormData)) {
    customHeaders.headers['Content-Type'] = 'application/json';
  }

  let totalUrl = baseUrl + url;
  if (!options.method || options.method.toUpperCase() === 'GET') {
    totalUrl = addBust(totalUrl);
  }

  const requestOptions = {...options, ...customHeaders};
  return isomorphicFetch(totalUrl, requestOptions)
    .then(checkStatus)
    .then((response) => {
      if (response.status === 204) {
        return undefined;
      }
      if (requestOptions.responseType === 'arraybuffer') {
        return response.arrayBuffer();
      } else if (requestOptions.responseType === 'text') {
        return response.text();
      }
      return response.json();
    })
  ;
}
