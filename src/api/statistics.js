import fetch from './helper';
import {saveAs} from 'browser-filesaver';

const apiUrl = '/api/stats';

export function getTop5Downloads() {
  return fetch(apiUrl + '/top5Downloads');
}

export function getTop5Views() {
  return fetch(apiUrl + '/top5Views');
}
export function importStatistics() {
  return fetch(apiUrl + '/addToImport', {
    responseType: 'arraybuffer',
  }).then((result) => {
    const blob = new Blob([result], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    saveAs(blob, 'medStats'  + new Date() + '.xlsx');
  });
}
