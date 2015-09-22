import { CALL_API } from '../actions/types';


export default store => next => action => {
  if (action.type !== CALL_API) {
    return next(action);
  }
  const {promise, types = [null, null, null]} = action.payload;
  if (typeof promise !== 'object' || typeof promise.then !== 'function') {
    throw new Error('Promise required');
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }

  const [requestType, successType, failureType] = types;

  const nextIfHaveAction = (fsa) => {
    if (fsa && fsa.type) {
      return next(fsa);
    }
  };

  nextIfHaveAction({type: requestType});

  return promise.then(
    response => nextIfHaveAction({
      payload: response,
      type: successType,
    }),
    error => nextIfHaveAction({
      type: failureType,
      payload: error,
      error: error.message || 'Something bad happened',
    })
  );
};
