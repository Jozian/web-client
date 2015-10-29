import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import loading from 'decorators/loading';
import cx from 'classnames';

import Header from 'components/Header';
import Button from 'components/Button';
import IconButton from 'components/IconButton';
import ActionButton from 'components/ActionButton';
import ActionButtonForModal from 'components/ActionButtonForModal';
import Footer from 'components/Footer';
import WhiteFooter from 'components/WhiteFooter';
import Table from 'components/Table/index.js';
import LoadingSpinner from 'components/LoadingSpinner';
import Modal from 'components/Modal';
import * as actions from 'actions/users.js';
import { baseUrl } from '../../api/helper';

import styles from './index.css';
import commonStyles from 'common/styles.css';

@connect(
  (state) => ({users: state.users, pendingActions: state.pendingActions, currentUser: state.currentUser }),
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

  onAddClick(value) {
    const { router } = this.context;
    router.transitionTo('addUser');
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
        text: 'Select all',
      }, {
        key: 'type',
        text: 'User Type',
        style: {
          width: '140px',
          maxWidth: '140px',
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

  usersTemplateLoading() {
    this.props.loadTemplateImport();
  }

  renderDeleteLibrariesPopup() {
    return (<Modal
      isOpen={this.state.isDeleteUsersPopupOpen}
      title="Are you sure you want to delete selected items?"
      className={commonStyles.modal}
    >
      <WhiteFooter>
        <ActionButtonForModal
          className={commonStyles.saveButtonModal}
          onClick={::this.deleteUsers}
          disabled={!this.state.selectedUsers.length}
          inProgress={this.props.pendingActions.deleteUsers}
        >
          Ok
        </ActionButtonForModal>
        <ActionButtonForModal className={commonStyles.cancelButtonModal} onClick={::this.hideDeleteUsersPopup}>Cancel</ActionButtonForModal>
      </WhiteFooter>
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
          <a className={styles.importContainer} href={`${baseUrl}/api/userManagement/getImportFile?token=${this.props.currentUser.token}`}>Download</a>

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
        <Button
          className={cx(styles.headerButton, commonStyles.headerButton, 'mdl2-add')}
          handleClick={this.handleAddUserClick}
          onClick={::this.onAddClick}
        ></Button>
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
            className="mdl2-delete"
            onClick={::this.showDeleteUsersPopup}
          >
          </Button>
          <Button
            className="mdl2-import"
            onClick={::this.showImportUsersPopup}
          >
          </Button>
        </Footer>
      </LoadingSpinner>
    </div>);
  }
}
