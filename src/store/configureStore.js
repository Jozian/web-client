import {createStore, combineReducers, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import * as reducers from '../reducers';

const reducer = combineReducers(reducers);

const createStoreWithMiddleware = applyMiddleware(
  logger
)(createStore);

export default createStoreWithMiddleware(reducer, {
  currentUser: null,
});
