import * as types from '../actions/types';
import * as mediaCommentsApi from '../api/media-comments.js';

export function loadComments(id) {
    return {
        type: types.CALL_API,
        payload: {
            types: [types.COMMENTS_LOADING, types.COMMENTS_LOADED, types.COMMENTS_ERROR],
            promise: mediaCommentsApi.getList(id),
        }
    }
}