import React from 'react';
import Router, {Route, DefaultRoute} from 'react-router';
import { Provider } from 'react-redux';

import App from './containers/App';
import UsersPage from './containers/UsersPage';
import LibrariesPage from './containers/LibrariesPage';
import StatisticsPage from './containers/StatisticsPage';
import CommentsPage from './containers/CommentsPage';
import MotdPage from './containers/MotdPage';

import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import store from './store/configureStore';

const routes = (
  <Route handler={App} path="/">
    <Route name="users" handler={UsersPage} />
    <Route name="libraries" handler={LibrariesPage} />
    <Route name="statistics" handler={StatisticsPage} />
    <Route name="comments" handler={CommentsPage} />
    <Route name="motd" handler={MotdPage} />
    <DefaultRoute handler={UsersPage} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Handler, routerState) => {
  const showDebugTools = window.location.hash.indexOf('debug') !== -1;
  React.render(<div>
      <Provider store={store}>
        { () => <Handler routerState={routerState} />}
      </Provider>
      {showDebugTools ? <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
      </DebugPanel> : null }
    </div>, document.getElementById('root'));
});
