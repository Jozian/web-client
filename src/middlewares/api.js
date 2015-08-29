import { CALL_API } from '../actions/types';


export default store => next => action => {
  if (action.type !== CALL_API) {
    return next(action);
  }

  const {promise, types} = action.payload;
  if (typeof promise !== 'object' || typeof promise.then !== 'function') {
    throw new Error('Promise required');
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => (typeof type === 'string' || typeof type === 'Symbol'))) {
    throw new Error('Expected action types to be strings or symbols');
  }

  const [requestType, successType, failureType] = types;

  next({
    type: requestType,
  });

  return promise.then(
    response => next({
      payload: response,
      type: successType,
    }),
    error => next({
      type: failureType,
      payload: error,
      error: error.message || 'Something bad happened',
    })
  );
};
