import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from 'components/Button';
import IconButton from 'components/IconButton';
import ActionButton from 'components/ActionButton';
import Footer from 'components/Footer';
import Table from 'components/Table/index.js';
import LoadingSpinner from 'components/LoadingSpinner';
import Modal from 'components/Modal';
import * as actions from 'actions/users.js';
import loading from 'decorators/loading';

import commonStyles from 'common/styles.css';

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
  };

  constructor(props) {
    super(props);
    props.loadUsers();
    this.state = {
      loading: true,
      selectedUsers: [],
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
    window.console.log(value);
  }

  onListSelectionChange(selectedUsers) {
    this.setState({ selectedUsers });
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

  async deleteUsers() {
    await this.props.deleteUsers(this.state.selectedUsers.map(u => u.id));
    this.props.loadUsers();
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


  render() {
    return (<div>
      { this.renderDeleteLibrariesPopup() }
      <h1>
        Users
        <IconButton
          className={commonStyles.headerButton}
          icon="fa fa-plus"
          tooltipText="Add new user"
          handleClick={this.handleAddUserClick}
        />
      </h1>
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
            onClick={this.handleImportUserClick}
          >
            Import
          </Button>
        </Footer>
      </LoadingSpinner>
    </div>);
  }
}
