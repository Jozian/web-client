import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import * as actions from 'actions/libraries';
import { loadUsers } from 'actions/users';
import DocumentTitle from 'components/DocumentTitle';
import Header from 'components/Header';
import Modal from 'components/Modal';
import Table from 'components/Table';
import IconButton from 'components/IconButton';
import ActionButton from 'components/ActionButton';
import ActionButtonForModal from 'components/ActionButtonForModal';
import Button from 'components/Button';
import Footer from 'components/Footer';
import WhiteFooter from 'components/WhiteFooter';
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

  renderEditLibrary(_, rowData) {
    return (<button
      className={cx(styles.editButton, 'mdl2-edit')}
      tabIndex="0"
      onClick={this.onJumpButtonClick.bind(this, rowData)}
      ></button>);
  }

  onJumpButtonClick(rowData, e) {
    e.stopPropagation();
    this.setState({
      editLibrary: {
        id: rowData.id,
        name: rowData.name,
      },
    });
  }

  renderName(_, rowData) {
    if (!this.state.editLibrary || this.state.editLibrary.id !== rowData.id) {
      return rowData.name;
    } else {
      return (
        <div onClick={ (e) => e.stopPropagation() }>
          <input type="text" value={this.state.editLibrary.name} role={`Edit library name ${rowData.name}`} autoFocus
                 onChange={::this.onChangeLibraryName}/>
          <Button
            onClick={this.sendNewLibraryName.bind(this, rowData)}
            >OK</Button>
          <Button
            onClick={::this.hideLibraryEdit}
            >Cancel</Button>
        </div>
      );
    }
  }

  onChangeLibraryName(e) {
    this.setState({
      editLibrary: {
        id: this.state.editLibrary.id,
        name: e.target.value,
      },
    });
  }

  async sendNewLibraryName(rowData) {
    await this.props.renameLibrary({id: rowData.id, name: this.state.editLibrary.name });
    this.props.loadLibraries();
    this.hideLibraryEdit();
  }

  hideLibraryEdit() {
    this.setState({
      editLibrary: undefined,
    });
  }

  config = {
    columns: [
      {
        key: 'name',
        text: 'Select all',
        renderer: ::this.renderName,
      }, {
        key: 'button',
        renderer: ::this.renderEditLibrary,
        className: styles.buttonEditLib,
      }, {
        key: 'folder',
        text: 'Folder',
        className: commonStyles.numberCell,
      }, {
        key: 'media',
        text: 'Media',
        className: commonStyles.numberCell,
      }, {
        key: 'views',
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
      <WhiteFooter>
        <ActionButtonForModal
          className={commonStyles.saveButtonModal}
          onClick={::this.deleteLibraries}
          disabled={!this.state.selectedLibraries.length}
          inProgress={this.props.pendingActions.deleteLibraries}
          >
          OK
        </ActionButtonForModal>
        <ActionButtonForModal className={commonStyles.cancelButtonModal} onClick={::this.hideDeleteLibrariesPopup}>Cancel</ActionButtonForModal>
      </WhiteFooter>
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
      <WhiteFooter>
        <ActionButtonForModal
          className={commonStyles.saveButtonModal}
          onClick={::this.createNewLibrary}
          disabled={!this.state.newLibraryName.length}
          inProgress={this.props.pendingActions.newLibrary}
          >
          Ok
        </ActionButtonForModal>
        <ActionButtonForModal className={commonStyles.cancelButtonModal} onClick={::this.hideNewLibraryPopup}>Cancel</ActionButtonForModal>
      </WhiteFooter>
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
        <WhiteFooter>
          <ActionButtonForModal
            className={commonStyles.saveButtonModal}
            onClick={::this.inviteUsers}
            inProgress={this.props.pendingActions.inviteUsers}
            >
            Invite
          </ActionButtonForModal>
          <ActionButtonForModal className={commonStyles.cancelButtonModal} onClick={::this.hideInviteUsersPopup}>Cancel</ActionButtonForModal>
        </WhiteFooter>
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
        <Button
          className={cx(commonStyles.headerButton, styles.buttonAdd, "mdl2-add")}
          onClick={::this.openNewLibraryPopup}
          ></Button>
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
          className="mdl2-delete"
          onClick={::this.openDeleteLibrariesPopup}
          >

        </Button>
        <Button
          disabled={!this.state.selectedLibraries.length}
          className="mdl2-add-friend"
          onClick={::this.openInviteUsersPopup}
          >
        </Button>
      </Footer>
    </div>);
  }
}

export default LibrariesPage;
