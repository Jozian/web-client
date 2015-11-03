import * as mediaApi from '../api/media';
import * as types from '../actions/types';

export function loadMedia(id) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.MEDIA_LOADING, types.MEDIA_LOADED, types.MEDIA_LOAD_ERROR],
      promise: mediaApi.getItem(id),
    },
  };
}

export function editMedia(id, data) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.MEDIA_UPDATING, types.MEDIA_UPDATED, types.MEDIA_UPDATE_ERROR],
      promise: mediaApi.editMedia(id, data),
    },
  };
}

export function uploadImage(id, imageData) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.PREV_IMAGE_UPLOADING, types.PREV_IMAGE_UPLOADED, types.PREV_IMAGE_ERROR],
      promise: mediaApi.uploadPrevImage(id, imageData),
    },
  };
}