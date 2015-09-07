import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from 'components/Button';
import IconButton from 'components/IconButton';
import Footer from 'components/Footer';
import Table from 'components/Table/index.js';
import * as actions from 'actions/users.js';
import LoadingSpinner from 'components/LoadingSpinner';
import loading from 'decorators/loading';

import commonStyles from 'common/styles.css';

@connect(
  (state) => ({users: state.users}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
@loading(
  (state) => state.users.loading,
  { isLoadingByDefault: true }
)
export default class UsersPage extends Component {

  static propTypes = {
    users: React.PropTypes.object.isRequired,
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

    this.setState({ loading: props.users.loading});
  }

  onRowClick(value) {
    window.console.log(value);
  }

  handleAddUserClick(e) {
    window.console.log(e);
  }

  handleDeleteUserClick(e) {
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

  render() {
    return (<div>
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
          className={commonStyles.table}
          config={this.config}
          data={this.props.users.entities}
          onRowClick={::this.onRowClick}
        />
        <Footer>
          <Button
            disabled={true}
            icon="fa fa-trash-o"
            onClick={this.handleDeleteUserClick}
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
