import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import * as actions from 'actions/libraries';
import { loadUsers } from 'actions/users';
import DocumentTitle from 'components/DocumentTitle';
import Header from 'components/Header';
import Modal from 'components/Modal';
import Table from 'components/Table';
import IconButton from 'components/IconButton';
import ActionButton from 'components/ActionButton';
import Button from 'components/Button';
import Footer from 'components/Footer';
import loading from 'decorators/loading';

import commonStyles from 'common/styles.css';
import styles from './index.css';

@connect(
  (state) => ({
    libraries: state.libraries, users: state.users, pendingActions: state.pendingActions,
  }),
  (dispatch) => bindActionCreators({...actions, loadUsers}, dispatch)
)
@loading(
  (state) => state.libraries.loading,
  { isLoadingByDefault: true },
)
class LibrariesPage extends Component {
  static propTypes = {
    libraries: React.PropTypes.object.isRequired,
    users: React.PropTypes.object.isRequired,
    pendingActions: React.PropTypes.object.isRequired,
    loadUsers: React.PropTypes.func.isRequired,
    loadLibraries: React.PropTypes.func.isRequired,
    createLibrary: React.PropTypes.func.isRequired,
    deleteLibraries: React.PropTypes.func.isRequired,
    inviteUsers: React.PropTypes.func.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedLibraries: [],
      newLibraryName: '',
    };
    props.loadLibraries();
    props.loadUsers();
  }

  onListSelectionChange(selectedLibraries) {
    this.setState({ selectedLibraries });
  }
  onSelectInvitedUser(invitedUsers) {
    this.setState({ invitedUsers });
  }

  onRowClick(data) {
    this.context.router.transitionTo('folder', {folderId: data.id});
  }

  onLibraryNameInputChange(event) {
    this.setState({
      newLibraryName: event.target.value,
    });
  }
  onDelKeyDown(e) {
    if (e.which === 46) {
      if (this.state.selectedLibraries.length === 0) {
        return;
      }
      this.openDeleteLibrariesPopup();
    }
  }
  getInvitedUsers() {
    const libIds = this.state.selectedLibraries.map(lib => parseInt(lib.id.slice(7), 10));
    const invited = [];
    this.props.users.entities.forEach((user) => {
      const userLibIds = user.libraries.map(lib => lib.id);
      if (libIds.every(libId => userLibIds.indexOf(libId) !== -1)) {
        invited.push(user);
      }
    });
    this.setState({alreadyInvited: invited});
  }

  openNewLibraryPopup() {
    this.setState({
      newLibraryName: '',
      isNewLibraryPopupOpen: true});
  }

  hideNewLibraryPopup() {
    this.setState({isNewLibraryPopupOpen: false});
  }

  openDeleteLibrariesPopup() {
    this.setState({isDeleteLibrariesPopupOpen: true});
  }

  hideDeleteLibrariesPopup() {
    this.setState({isDeleteLibrariesPopupOpen: false});
  }

  openInviteUsersPopup() {
    this.getInvitedUsers();
    this.setState({isInviteUsersPopupOpen: true});
  }
  hideInviteUsersPopup() {
    this.setState({isInviteUsersPopupOpen: false});
  }

  config = {
    columns: [
      {
        key: 'name',
        text: 'Name',
      },
      {
        key: 'folder',
        icon: 'fa fa-folder-open',
        text: 'Folder',
        className: commonStyles.numberCell,
      }, {
        key: 'media',
        icon: 'fa fa-file',
        text: 'Media',
        className: commonStyles.numberCell,
      }, {
        key: 'views',
        icon: 'fa fa-eye',
        text: 'Views',
        className: commonStyles.numberCell,
      },
    ],
    selectable: true,
  }

  configInviteUsers = {
    columns: [
      {
        key: 'name',
        text: 'Select all',
      },
    ],
    selectable: true,
  }

  async createNewLibrary(event) {
    event.preventDefault();
    if (this.props.pendingActions.newLibrary) {
      return;
    }

    if (!this.state.newLibraryName.length) {
      return;
    }
    await this.props.createLibrary(this.state.newLibraryName);
    this.hideNewLibraryPopup();
    this.props.loadLibraries();
  }

  deleteLibraries() {
    if (this.state.selectedLibraries.length === 0) {
      return;
    }

    this.props.deleteLibraries(this.state.selectedLibraries.map((l) => l.id))
      .then(::this.hideDeleteLibrariesPopup)
  .then(() => this.setState({selectedLibraries: []}))
      .then(this.props.loadLibraries)

      .catch(::this.hideDeleteLibrariesPopup)
  .then(this.props.loadLibraries)
    ;
  }

  async inviteUsers(event) {
    event.preventDefault();
    if (this.props.pendingActions.inviteUsers) {
      return;
    }
    if (!this.state.invitedUsers.length) {
      return;
    }

    const params = {};
    params.libraries = this.state.selectedLibraries.map(lib => lib.id);
    params.users = this.state.invitedUsers.map(invUsr => invUsr.id);
    params.removeUsers = this.props.users.entities.map(user => user.id)
      .filter(userId => params.users.indexOf(userId) === -1);

    await this.props.inviteUsers(params);

    this.hideInviteUsersPopup();

    this.props.loadUsers();
  }

  renderDeleteLibrariesPopup() {
    return (<Modal
      isOpen={this.state.isDeleteLibrariesPopupOpen}
      title="Are you sure you want to delete selected items?"
      className={styles.newLibraryModal}
      >
      <Footer>
        <ActionButton
          icon="fa fa-check"
          onClick={::this.deleteLibraries}
          disabled={!this.state.selectedLibraries.length}
          inProgress={this.props.pendingActions.deleteLibraries}
          >
          Ok
        </ActionButton>
        <Button icon="fa fa-ban" onClick={::this.hideDeleteLibrariesPopup}>Cancel</Button>
      </Footer>
    </Modal>);
  }

  renderNewLibraryPopup() {
    return (<Modal
      isOpen={this.state.isNewLibraryPopupOpen}
      title="New Library"
      className={styles.newLibraryModal}
      >
      <form onSubmit={::this.createNewLibrary}>
        <label className>
          Name:
          <input
            type="text"
            placeholder="i.e. English"
            autoFocus
            value={this.state.newLibraryName}
            onChange={::this.onLibraryNameInputChange}
            />
        </label>
      </form>
      <Footer>
        <ActionButton
          icon="fa fa-check"
          onClick={::this.createNewLibrary}
          disabled={!this.state.newLibraryName.length}
          inProgress={this.props.pendingActions.newLibrary}
          >
          Ok
        </ActionButton>
        <Button icon="fa fa-ban" onClick={::this.hideNewLibraryPopup}>Cancel</Button>
      </Footer>
    </Modal>);
  }

  renderInviteUsersPopup() {
    return (<Modal
      isOpen={this.state.isInviteUsersPopupOpen}
      title="Invite Users"
      className={styles.inviteUsersModal}
      >
      <Table
        overlayClassName={styles.inviteTable}
        className={commonStyles.table}
        ref="table"
        config={this.configInviteUsers}
        data={this.props.users.entities}
        onSelectionChange={::this.onSelectInvitedUser}
        initSelection={this.state.alreadyInvited}
        />
      <Footer>
        <ActionButton
          icon="fa fa-check"
          onClick={::this.inviteUsers}
          inProgress={this.props.pendingActions.inviteUsers}
          >
          Ok
        </ActionButton>
        <Button icon="fa fa-ban" onClick={::this.hideInviteUsersPopup}>Cancel</Button>
      </Footer>
    </Modal>);
  }

  render() {
    return (<div onKeyDown={::this.onDelKeyDown}>
      <DocumentTitle title="Libraries" />
      { this.renderNewLibraryPopup() }
      { this.renderDeleteLibrariesPopup() }
      { this.renderInviteUsersPopup() }
      <Header>
        Libraries
        <IconButton
          className={commonStyles.headerButton}
          onClick={::this.openNewLibraryPopup}
          icon="fa fa-plus"
          tooltipText="Add new library"
          />
      </Header>
      <Table
        overlayClassName={commonStyles.tableOverlay}
        className={commonStyles.table}
        ref="table"
        config={this.config}
        data={this.props.libraries.entities}
        onRowClick={::this.onRowClick}
        onSelectionChange={::this.onListSelectionChange}
        />
      <Footer>
        <Button
          disabled={!this.state.selectedLibraries.length}
          icon="fa fa-trash-o"
          onClick={::this.openDeleteLibrariesPopup}
          >
          Delete
        </Button>
        <Button
          disabled={!this.state.selectedLibraries.length}
          icon="fa fa-user"
          onClick={::this.openInviteUsersPopup}
          >
          Invite users
        </Button>
      </Footer>
    </div>);
  }
}

export default LibrariesPage;
