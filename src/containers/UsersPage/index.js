import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from 'components/Header';
import Button from 'components/Button';
import IconButton from 'components/IconButton';
import ActionButton from 'components/ActionButton';
import Footer from 'components/Footer';
import Table from 'components/Table/index.js';
import LoadingSpinner from 'components/LoadingSpinner';
import Modal from 'components/Modal';
import * as actions from 'actions/users.js';
import loading from 'decorators/loading';

import styles from './index.css';
import commonStyles from 'common/styles.css';
import { RouteHandler } from 'react-router';

@connect(
  (state) => ({users: state.users, pendingActions: state.pendingActions}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
@loading(
  (state) => state.users.loading,
  { isLoadingByDefault: true }
)
export default class UsersPage extends Component {

  static propTypes = {
    users: React.PropTypes.object.isRequired,
    pendingActions: React.PropTypes.object.isRequired,
    deleteUsers: React.PropTypes.func.isRequired,
    loadUsers: React.PropTypes.func.isRequired,
    uploadUsers: React.PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    props.loadUsers();
    this.state = {
      loading: true,
      selectedUsers: [],
      selectedFileName: '',
      uploadFileData: null,
    };
  }

  componentWillUpdate(props) {
    if (props === this.props) {
      return;
    }

    this.setState({
      loading: props.users.loading,
      isDeleteUsersPopupOpen: false,
    });
  }

  onRowClick(value) {
    const { router } = this.context;
    router.transitionTo('editUser', {id: value.id});
  }

  onListSelectionChange(selectedUsers) {
    this.setState({ selectedUsers });
  }
  onDelKeyDown(e) {
    if (e.which === 46) {
      if (this.state.selectedUsers.length === 0) {
        return;
      }
      this.showDeleteUsersPopup();
    }
  }

  handleAddUserClick(e) {
    window.console.log(e);
  }

  handleImportUserClick(e) {
    window.console.log(e);
  }

  displayChecked() {
    window.console.log(this.refs.table.getChecked());
  }

  config = {
    columns: [
      {
        key: 'name',
      }, {
        key: 'type',
        icon: 'fa fa-user',
        text: 'User Type',
        style: {
          width: '70px',
          maxWidth: '70px',
        },
      },
    ],
    selectable: true,
  };

  showDeleteUsersPopup() {
    this.setState({
      isDeleteUsersPopupOpen: true,
    });
  }

  hideDeleteUsersPopup() {
    this.setState({
      isDeleteUsersPopupOpen: false,
    });
  }

  showImportUsersPopup() {
    this.setState({
      isImportUsersPopupOpen: true,
    });
  }

  hideImportUsersPopup() {
    this.setState({
      isImportUsersPopupOpen: false,
      selectedFileName: '',
      uploadFileData: null,
    });
  }

  async deleteUsers() {
    await this.props.deleteUsers(this.state.selectedUsers.map(u => u.id));
    this.props.loadUsers();
  }
  async uploadFile(e) {
    e.preventDefault();
    if (this.props.pendingActions.uploadUsers) {
      return;
    }
    await this.props.uploadUsers(this.state.uploadFileData);
    this.hideImportUsersPopup();
    this.props.loadUsers();
  }

  handlerUploadFile(e) {
    this.setState({
      selectedFileName: e.target.files[0].name,
      uploadFileData: new FormData(e.target.form),
    });
  }
  renderDeleteLibrariesPopup() {
    return (<Modal
      isOpen={this.state.isDeleteUsersPopupOpen}
      title="Are you sure you want to delete selected items?"
      className={commonStyles.modal}
    >
      <Footer>
        <ActionButton
          icon="fa fa-check"
          onClick={::this.deleteUsers}
          disabled={!this.state.selectedUsers.length}
          inProgress={this.props.pendingActions.deleteUsers}
        >
          Ok
        </ActionButton>
        <Button icon="fa fa-ban" onClick={::this.hideDeleteUsersPopup}>Cancel</Button>
      </Footer>
    </Modal>);
  }
  renderImportUsersPopup() {
    return (<Modal
      isOpen={this.state.isImportUsersPopupOpen}
      title="UPLOAD FILE"
      className={commonStyles.modal}
      >
      <form onSubmit={::this.uploadFile} method="post" encType="multipart/form-data">
        <lable className={styles.importLabel} >File:</lable>
        <lable className={styles.wrapLabel}>
          <input type="file" name="file" className={styles.inputFile}
                 onChange={::this.handlerUploadFile} />
          <div className={styles.importContainer} type="button">Upload template</div>
          <a className={styles.importContainer}
             href="/userImportTemplate.xlsx">Download</a>
        </lable>
        <span className={styles.fileNameSpan}>{this.state.selectedFileName}</span>
      </form>
      <Footer>
        <ActionButton
          icon="fa fa-check"
          onClick={::this.uploadFile}
          disabled={!this.state.selectedFileName.length}
          inProgress={this.props.pendingActions.uploadUsers}
          >
          Ok
        </ActionButton>
        <Button icon="fa fa-ban" onClick={::this.hideImportUsersPopup}>Cancel</Button>
      </Footer>
    </Modal>);
  }

  render() {
    return (<div onKeyDown={::this.onDelKeyDown}>
      { this.renderDeleteLibrariesPopup() }
      { this.renderImportUsersPopup() }
      <Header>
        Users
        <IconButton
          className={commonStyles.headerButton}
          icon="fa fa-plus"
          tooltipText="Add new user"
          handleClick={this.handleAddUserClick}
        />
      </Header>
      <LoadingSpinner loading={this.state.loading}>
        <Table
          ref="table"
          overlayClassName={commonStyles.tableOverlay}
          className={commonStyles.table}
          config={this.config}
          data={this.props.users.entities}
          onRowClick={::this.onRowClick}
          onSelectionChange={::this.onListSelectionChange}
        />
        <Footer>
          <Button
            disabled={!this.state.selectedUsers.length}
            icon="fa fa-trash-o"
            onClick={::this.showDeleteUsersPopup}
          >
            Delete
          </Button>
          <Button
            icon="fa fa-upload"
            onClick={::this.showImportUsersPopup}
          >
            Import
          </Button>
        </Footer>
      </LoadingSpinner>
    </div>);
  }
}
