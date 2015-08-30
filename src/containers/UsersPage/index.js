import React, { Component } from 'react';
import Button from '../../components/Button';
import {USERS_LOADING, USERS_LOADED, USERS_LOAD_ERROR} from '../../actions/types.js';
import { connect } from 'react-redux';
import style from './index.css';
import IconButton from '../../components/IconButton';
import Table from '../../components/Table/index.js';
import { boldTextRender } from '../../components/Table/renders.js';
import * as actions from '../../actions/users.js';
import { bindActionCreators } from 'redux';

@connect(
  (state) => ({users: state.users}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
class UsersPage extends Component {

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
    return (<div className={style.usersHolder}>
      <h1 className={style.header}>Users</h1>
      <IconButton icon="fa fa-plus" tooltipText="Add new user" handleClick={this.handleAddUserClick} />
      <Table ref="table" config={this.config} data={this.props.users.entities} onRowClick={::this.onRowClick}/>
      <footer className={style.footer}>
        <Button icon="fa fa-trash-o" text="DELETE" onClick={this.handleDeleteUserClick}/>
        <Button text="IMPORT" onClick={this.handleImportUserClick}/>
      </footer>
    </div>);
  }
}

function mapStateToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  { USERS_LOADING, USERS_LOADED, USERS_LOAD_ERROR }
)(UsersPage);
