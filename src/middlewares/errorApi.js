import { APPLICATION_ERROR } from '../actions/types';

export default store => next => action => {

  if (!action.error) {
    return next(action);
  } else {
    store.dispatch({
      type: APPLICATION_ERROR,
    });
  }

};
