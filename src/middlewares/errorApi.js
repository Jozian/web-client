import { APPLICATION_ERROR, CLIENT_ERROR } from '../actions/types';

export default store => next => action => {

  if (action.error && action.errorStatus > 500) {
    store.dispatch({
      type: APPLICATION_ERROR,
    });
  } else if (action.error && action.errorStatus >= 400 && action.errorStatus === 403) {
    store.dispatch({
      type: CLIENT_ERROR,
      status: action.errorStatus,
    });
  } else {
    return next(action);
  }
};
