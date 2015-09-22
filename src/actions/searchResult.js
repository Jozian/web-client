import * as searchResultApi from '../api/searchResult.js';
import * as types from '../actions/types';

export function loadSearchResult(data) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.SEARCH_RESULT_UPLOADING, types.SEARCH_RESULT_UPLOADED, types.SEARCH_RESULT_ERROR],
      promise: searchResultApi.getSearchResult(data),
    },
  };
}
