import * as types from 'actions/types';
import * as mediaCommentsApi from 'api/media-comments.js';

export function loadComments(id) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.COMMENTS_LOADING, types.COMMENTS_LOADED, types.COMMENTS_LOAD_ERROR],
      promise: mediaCommentsApi.getList(id).then((response) => ({
        data: response,
      })),
    },
  };
}

export function deleteComments(ids) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.COMMENTS_DELETING, types.COMMENTS_DELETED, types.COMMENTS_DELETE_ERROR],
      promise: mediaCommentsApi.deleteComments(ids),
    },
  };
}

export function createComment(data) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.COMMENT_CREATING, types.COMMENT_CREATED, types.COMMENT_CREATING_ERROR],
      promise: mediaCommentsApi.createComment(data),
    },
  };
}

export function updateComment(commentData) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.COMMENT_UPDATING, types.COMMENT_UPDATED, types.COMMENT_UPDATE_ERROR],
      promise: mediaCommentsApi.updateComment(commentData),
    },
  };
}