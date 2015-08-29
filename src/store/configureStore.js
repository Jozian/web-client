import {createStore, combineReducers, applyMiddleware} from 'redux';
import apiMiddleware from '../middlewares/api';
import logger from 'redux-logger';
import * as reducers from '../reducers';

const reducer = combineReducers(reducers);

const createStoreWithMiddleware = applyMiddleware(
  apiMiddleware,
  logger
)(createStore);

export default createStoreWithMiddleware(reducer, {
  currentUser: null,
  statistics: {top5Downloads: [], top5Views: []},
  libraries: [],
});
