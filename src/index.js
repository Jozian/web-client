import React from 'react';
import Router, {Route, DefaultRoute} from 'react-router';
import { Provider } from 'react-redux';

import App from './containers/App';
import UsersPage from './containers/UsersPage';
import LibrariesPage from './containers/LibrariesPage';
import FolderPage from './containers/FolderPage';
import StatisticsPage from './containers/StatisticsPage';
import CommentsPage from './containers/CommentsPage';
import MotdPage from './containers/MotdPage';
import store from './store/configureStore';

const routes = (
  <Route handler={App} path="/">
    <Route name="users" handler={UsersPage} />
    <Route name="libraries">
      <DefaultRoute handler={LibrariesPage} />
      <Route name="folder" path="/folder/:id" handler={FolderPage} />
    </Route>
    <Route name="statistics" handler={StatisticsPage} />
    <Route name="comments" handler={CommentsPage} />
    <Route name="motd" handler={MotdPage} />
    <DefaultRoute handler={LibrariesPage} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Handler, routerState) => {
  React.render(<div>
      <Provider store={store}>
        { () => <Handler routerState={routerState} />}
      </Provider>
    </div>, document.getElementById('root'));
});
