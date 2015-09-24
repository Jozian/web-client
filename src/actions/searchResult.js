import * as searchResultApi from '../api/searchResult';
import * as types from '../actions/types';

export function loadSearchResult(searchString) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.SEARCH_RESULT_LOADING, types.SEARCH_RESULT_LOADED, types.SEARCH_RESULT_ERROR],
      promise: searchResultApi.getSearchResult(searchString),
    },
  };
}
