import React from 'react';
import Router, {Route, DefaultRoute, Redirect} from 'react-router';
import { Provider } from 'react-redux';
import Modal from 'react-modal';


import App from 'containers/App';
import UsersPage from 'containers/UsersPage';
import LibrariesPage from 'containers/LibrariesPage';
import FolderPage from 'containers/FolderPage';
import StatisticsPage from 'containers/StatisticsPage';
import CommentsPage from 'containers/CommentsPage';
import MotdPage from 'containers/MotdPage';
import store from 'store/configureStore';
import CommentDetails from 'containers/CommentDetailsPage';

const routes = (

  <Route handler={App} path="/">
    <Route name="users" handler={UsersPage} />
    <Route name="libraries">
      <DefaultRoute handler={LibrariesPage} />
      <Route name="folder" path="/folder/:folderId" handler={FolderPage} />
      <Route name="folderSelection" path="/folder/:folderId/:itemType/:itemId" handler={FolderPage} />
    </Route>
    <Route name="statistics" handler={StatisticsPage} />
    <Route name="comments" handler={CommentsPage} />
    <Route name="motd" handler={MotdPage} />
    <Redirect from="/" to="libraries" />
    <DefaultRoute handler={LibrariesPage} />
    <Route name="comment" path="comments/:mediaName/:id/" handler={CommentDetails}/>
  </Route>
);

Modal.setAppElement(document.getElementById('root'));
Modal.injectCSS();

Router.run(routes, Router.HistoryLocation, (Handler, routerState) => {
  React.render(<div>
      <Provider store={store}>
        { () => <Handler routerState={routerState} />}
      </Provider>
    </div>, document.getElementById('root'));
});
