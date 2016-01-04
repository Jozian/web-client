import { CLIENT_ERROR } from '../actions/types';

export default store => next => action => {
  if (action.errorMsg && action.status >= 400 && action.status < 600) {
    store.dispatch({
      type: CLIENT_ERROR,
      statusError: action.status,
      errorMsg: action.errorMsg,
    });
  } else {
    return next(action);
  }
};
