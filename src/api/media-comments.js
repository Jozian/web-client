import fetch from './helper';

const apiUrl = '/api/media/';

export function getList(id) {
    return fetch(apiUrl + id);
}
