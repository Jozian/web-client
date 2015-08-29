import fetch from './helper';

const apiUrl = '/api/motd';

export function getMotd() {
  return fetch(apiUrl);
}

export function update(body) {
  if (!body || !body.text) {
    return Promise.reject('Invalid body');
  }

  return fetch(apiUrl, {
    method: 'post',
    body: JSON.stringify(body),
  });
}
