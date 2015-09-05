import * as motdApi from '../api/motd.js';
import * as types from '../actions/types';

export function loadMOTD() {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.MOTD_LOADING, types.MOTD_LOADED, types.MOTD_LOAD_ERROR],
      promise: motdApi.getMotd(),
    },
  };
}
export function updateMOTD(motd) {
  return {
    type: types.CALL_API,
    payload: {
      types: [types.MOTD_UPDATING, types.MOTD_UPDATED, types.MOTD_UPDATE_ERROR],
      promise: motdApi.updateMotd(motd),
    },
  };
}
