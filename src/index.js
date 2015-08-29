import React from 'react';
import Router, {Route, DefaultRoute} from 'react-router';
import { Provider } from 'react-redux';

import App from './containers/App';
import UsersPage from './containers/UsersPage';
import LibrariesPage from './containers/LibrariesPage';

import store from './store/configureStore';

const routes = (
  <Route handler={App} path="/">
    <Route name="users" handler={UsersPage} />
    <Route name="libraries" handler={LibrariesPage} />
    <DefaultRoute handler={UsersPage} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, (Handler, routerState) => {
  React.render(<Provider store={store}>
    { () => <Handler routerState={routerState} />}
  </Provider>, document.getElementById('root'));
});
