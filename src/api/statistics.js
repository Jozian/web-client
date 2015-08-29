import fetch from './helper';

const apiUrl = '/api/stats';

export function getTop5Downloads() {
  return fetch(apiUrl + '/top5Downloads');
}

export function getTop5Views() {
  return fetch(apiUrl + '/top5Views');
}
