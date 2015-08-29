import {createStore, combineReducers, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import * as reducers from '../reducers';

const reducer = combineReducers(reducers);

const createStoreWithMiddleware = applyMiddleware(
  promisesMiddleware,
  logger
)(createStore);

const store = createStoreWithMiddleware(reducer, {
  issues: [],
  repository: '',
  counter: 0,
});

export default store;
