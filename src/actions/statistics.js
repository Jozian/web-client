import * as statisticsApi from '../api/statistics.js';
import * as types from '../actions/types';

export function loadStatistics() {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.STATISTICS_LOADING, types.STATISTICS_LOADED, types.STATISTICS_LOAD_ERROR],
      promise: Promise.all([
        statisticsApi.getTop5Downloads(),
        statisticsApi.getTop5Views(),
      ]).then((response) => ({
        top5Downloads: response[0],
        top5Views: response[1],
      })),
    },
  };
}
export function addToExport() {
  return {
    type: types.CALL_API,
    payload: {
      promise: statisticsApi.importStatistics(),
    },
  };
}
