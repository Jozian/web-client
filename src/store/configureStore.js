import {compose, createStore, combineReducers, applyMiddleware} from 'redux';
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
  createStore
);

const store = createFinalStore(reducer, {
  currentUser: null,
  statistics: {
    loading: false,
    entities: {
      top5Downloads: [],
      top5Views: [],
    },
  },
  libraries: {
    loading: false,
    entities: [],
  },
  users: {
    loading: false,
    entities: [],
  },
  activeFolder: {
    loading: false,
    entity: {
      data: new WinJS.Binding.List([]),
    },
  },
  user: {
    loading: false,
    entity: {},
  },
  motd: {
    loading: false,
    entity: {},
  },
});

export default store;
