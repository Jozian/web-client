import fetch from './helper';
import {saveAs} from 'browser-filesaver';

const apiUrl = '/api/users';
const isUniqueUrl = '/api/userManagement/isUnique';
const userManagementUrl = '/api/userManagement';

export function getList() {
  return fetch(apiUrl);
}

export function getItem(id) {
  if (!id || typeof id  !== 'string') {
    return Promise.reject('Invalid UserId');
  }

  return fetch(apiUrl + '/' + id);
}

export function add(body) {
  if (!body || !body.name || !body.login || !body.password || !body.type) {
    return Promise.reject('Invalid body');
  }
  return fetch(apiUrl, {
    method: 'post',
    body: JSON.stringify(body),
  });
}

export function edit(id, body) {
  if (!body || !body.name || !body.login || !body.type) {
    return Promise.reject('Invalid body');
  }
  if (typeof id  !== 'string') {
    return Promise.reject('Invalid UserId');
  }
  return fetch(apiUrl + '/' + id, {
    method: 'put',
    body: JSON.stringify(body),
  });
}

export function deleteUsers(body) {
  // body is an array of ids
  if (!body || !body instanceof Array) {
    return Promise.reject('Invalid body');
  }

  return fetch(apiUrl, {
    method: 'delete',
    body: JSON.stringify(body),
  });
}

export function isUnique(body) {
  if (!body || !body.key || !body.value) {
    return Promise.reject('Invalid body');
  }

  return fetch(isUniqueUrl, {
    method: 'post',
    body: JSON.stringify(body),
  });
}
export function uploadFile(body) {
  if (!body || !(body instanceof FormData)) {
    return Promise.reject('Invalid body');
  }

  return fetch(userManagementUrl + '/userImport', {
    method: 'post',
    body: body,
    responseType: 'text',
  });
}

export function userLogout() {
  localStorage.removeItem('MEDuser');
  localStorage.removeItem('MEDtoken');
  return Promise.resolve('success');
}

export function dontAskUser() {
  const userData = JSON.parse(localStorage.getItem('MEDuser'));
  if (!userData) {
    Promise.reject('User does not found');
  } else {
    userData.hideInvitePopup = true;
    localStorage.setItem('MEDuser', JSON.stringify(userData));
  }
}

export function loadUserTemplate() {
  return fetch(userManagementUrl + '/getImportFile', {
    method: 'get',
    responseType: 'arraybuffer',
  }).then((result) => {
    const blob = new Blob([result], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    saveAs(blob, 'medComments'  + new Date() + '.xlsx');
  });
}
