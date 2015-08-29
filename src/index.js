import React from 'react';
import Router, {Route, DefaultRoute} from 'react-router';
import { Provider } from 'react-redux';

import App from './containers/App';
import UsersPage from './containers/UsersPage';
import LibrariesPage from './containers/LibrariesPage';
import CommentsPage from './containers/CommentsPage';
import MotdPage from './containers/MotdPage';

import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import store from './store/configureStore';

const routes = (
  <Route handler={App} path="/">
    <Route name="users" handler={UsersPage} />
    <Route name="libraries" handler={LibrariesPage} />
    <Route name="comments" handler={CommentsPage} />
    <Route name="motd" handler={MotdPage} />
    <DefaultRoute handler={UsersPage} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Handler, routerState) => {
  React.render(<div>
      <Provider store={store}>
        { () => <Handler routerState={routerState} />}
      </Provider>
      <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
      </DebugPanel>
    </div>, document.getElementById('root'));
});
