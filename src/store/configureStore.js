import {compose, createStore, combineReducers, applyMiddleware} from 'redux';
import { devTools, persistState } from 'redux-devtools';
import * as reducers from '../reducers';
import createLogger from 'redux-logger';

import apiMiddleware from '../middlewares/api';

const logger = createLogger({
  level: 'info',
  collapsed: true,
});

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
