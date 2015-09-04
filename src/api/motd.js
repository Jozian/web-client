import fetch from './helper';

const apiUrl = '/api/motd';

export function getMotd() {
  return fetch(apiUrl);
}

export function updateMotd(motd) {
  if (!motd) {
    return Promise.reject('Invalid motd');
  }

  return fetch(apiUrl, {
    method: 'post',
    body: JSON.stringify({ text: motd }),
  });
}
