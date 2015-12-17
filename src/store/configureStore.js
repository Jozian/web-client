import {compose, createStore, combineReducers, applyMiddleware} from 'redux';
import * as reducers from '../reducers';
import createLogger from 'redux-logger';

import apiMiddleware from '../middlewares/api';
import errorApi from '../middlewares/errorApi';

const logger = createLogger({
  level: 'info',
  collapsed: true,
});

const reducer = combineReducers(reducers);

const createFinalStore = compose(
  applyMiddleware(
    apiMiddleware,
    errorApi,
    logger
  ),
  createStore
);

const store = createFinalStore(reducer, {
  currentUser: null,
  errorApplication: null,
  clientError: {},
  statistics: {
    loading: false,
    entities: {
      top5Downloads: [],
      top5Views: [],
    },
  },
  comments: {
    loading: false,
    entity: {
      data: new WinJS.Binding.List([]),
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
  activeMedia: {
    loading: false,
    entity: {
      data: new WinJS.Binding.List([]),
    },
  },
  user: {
    loading: false,
    isNew: false,
    entity: {},
  },
  folder: {
    loading: false,
    entity: {},
  },
  motd: {
    loading: false,
    entity: {},
  },
  searchResult: {
    loading: false,
    entities: {
      media: [],
      users: [],
    },
  },
});

export default store;
