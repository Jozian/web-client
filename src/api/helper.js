import isomorphicFetch from 'isomorphic-fetch';
import store from '../store/configureStore';

//FIXME: ENV BASED BUILD
const baseUrl = 'http://medserver.apps.wookieelabs.com';

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
      'Accept': 'application/json',
    },
  };
  const requestOptions = {...options, ...customHeaders};
  return isomorphicFetch(baseUrl + url, requestOptions)
    .then(checkStatus)
    .then((response) => {
      if (response.status === 204) {
        return undefined;
      }
      if (requestOptions.responseType === 'arraybuffer') {
        return response.arrayBuffer();
      }
      return response.json();
    })
  ;
}
