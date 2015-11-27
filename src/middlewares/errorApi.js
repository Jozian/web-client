import { APPLICATION_ERROR } from '../actions/types';

export default store => next => action => {

  if (action.error && action.errorStatus < 500) {
    store.dispatch({
      type: APPLICATION_ERROR,
    });
  } else {
    return next(action);
  }
};
