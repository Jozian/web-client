import * as mediaApi from '../api/media';
import * as commentsApi from '../api/comments';
import * as types from '../actions/types';

export function loadMediaList() {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.MEDIA_LIST_LOADING, types.MEDIA_LIST_LOADED, types.MEDIA_LIST_LOAD_ERROR],
      promise: mediaApi.getMediaList(),
    },
  };
}

export function exportComments() {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.COMMENTS_EXPORTING, types.COMMENTS_EXPORTED, types.COMMENTS_EXPORT_ERROR],
      promise: commentsApi.exportComments(),
    },
  };
}
