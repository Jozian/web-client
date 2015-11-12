function setLocalStorageData(name, data) {
  window.localStorage.setItem(name, data);
}

function getTokenStorage() {
  return window.localStorage.getItem('MEDtoken');
}

function getUserStorage() {
  return window.localStorage.getItem('MEDuser');
}
