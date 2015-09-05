import * as types from '../actions/types';

export const removePendingToast = (toast) => ({
  type: types.REMOVE_PENDING_TOAST,
  payload: toast,
});
