import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '../../components/Button';
import common from '../../common/styles.css';
import IconButton from '../../components/IconButton';
import PageFooter from '../../components/PageFooter';
import Table from '../../components/Table/index.js';
import { boldTextRender } from '../../components/Table/renders.js';
import * as actions from '../../actions/users.js';
import LoadingSpinner from '../../components/LoadingSpinner';


@connect(
  (state) => ({users: state.users}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
export default class UsersPage extends Component {

  static propTypes = {
    users: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    props.loadUsers();
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
        render: boldTextRender,
      }, {
        key: 'type',
        icon: 'fa fa-user',
        text: 'User Type',
        render: boldTextRender,
      },
    ],
    noCheck: false,
  };

  render() {
    return (<div>
      <h1>
        Users
        <IconButton
          className={common.headerButton}
          icon="fa fa-plus"
          tooltipText="Add new user"
          handleClick={this.handleAddUserClick}
        />
      </h1>
      <LoadingSpinner loading={this.props.users.loading}>
        <Table
          ref="table"
          className={common.table}
          config={this.config}
          data={this.props.users.entities}
          onRowClick={::this.onRowClick}
        />
        <PageFooter>
          <Button icon="fa fa-trash-o" text="Delete" onClick={this.handleDeleteUserClick}/>
          <Button text="Import" onClick={this.handleImportUserClick}/>
        </PageFooter>
      </LoadingSpinner>
    </div>);
  }
}
