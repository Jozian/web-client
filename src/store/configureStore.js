import {compose, createStore, combineReducers, applyMiddleware} from 'redux';
import apiMiddleware from '../middlewares/api';
import { devTools, persistState } from 'redux-devtools';

import logger from 'redux-logger';
import * as reducers from '../reducers';

const reducer = combineReducers(reducers);

const createFinalStore = compose(
  applyMiddleware(
    apiMiddleware,
    logger
  ),
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
  createStore
);

export default createFinalStore(reducer, {
  currentUser: null,
  statistics: {top5Downloads: [], top5Views: []},
  libraries: {
    loading: false,
    entities: [],
  },
  users: {
    loading: false,
    entities: [],
  },
});
