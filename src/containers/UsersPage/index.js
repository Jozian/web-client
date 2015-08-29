import React, { Component } from 'react';
import Button from '../../components/Button';
import {USERS_LOADING, USERS_LOADED, USERS_LOAD_ERROR} from '../../actions/types.js';
import { connect } from 'react-redux';
import style from './index.css';
import IconButton from '../../components/IconButton';
import Table from '../../components/Table/index.js';
import {boldTextRender, buttonRender, dateRender} from '../../components/Table/renders.js';

class UsersPage extends Component {
  handleAddUserClick(e) {
    console.log(e);
  }

  handleDeleteUserClick(e) {
    console.log(e);
  }

  handleImportUserClick(e) {
    console.log(e);
  }

  onRowClick(value) {
    console.log(value);
  }

  displayChecked() {
    console.log(this.refs.table.getChecked());
  }

  config = {
    columns: [
      {
        key: 'name',
        render: boldTextRender
      }, {
        key: 'type',
        icon: 'fa fa-user',
        text: 'User Type',
        render: boldTextRender
      }
    ],
    noCheck: false,
  };

  data = [{"id":1,"login":"demo","type":"admin","name":"Demo user","libraries":[{"id":8,"name":"imageTest","createdAt":"2014-09-24T17:31:41.000Z","updatedAt":"2014-09-24T17:31:41.000Z","CompanyId":1,"librariesUser":{"createdAt":"2014-12-01T09:48:21.000Z","updatedAt":"2014-12-01T09:48:21.000Z","UserId":1,"LibraryId":8}},{"id":17,"name":"Sanna's Lib","createdAt":"2014-09-28T14:22:25.000Z","updatedAt":"2014-09-28T14:22:25.000Z","CompanyId":1,"librariesUser":{"createdAt":"2014-12-01T09:48:21.000Z","updatedAt":"2014-12-01T09:48:21.000Z","UserId":1,"LibraryId":17}},{"id":105,"name":"Update Test","createdAt":"2015-05-06T15:55:09.000Z","updatedAt":"2015-05-06T15:55:09.000Z","CompanyId":1,"librariesUser":{"createdAt":"2015-05-06T17:51:20.000Z","updatedAt":"2015-05-06T17:51:20.000Z","UserId":1,"LibraryId":105}},{"id":106,"name":"MED DEMO for MSFT","createdAt":"2015-05-06T18:18:04.000Z","updatedAt":"2015-05-06T18:18:04.000Z","CompanyId":1,"librariesUser":{"createdAt":"2015-08-29T15:45:24.000Z","updatedAt":"2015-08-29T15:45:24.000Z","UserId":1,"LibraryId":106}}]},{"id":2,"login":"demo2","type":"operator","name":"Demo user2","libraries":[{"id":8,"name":"imageTest","createdAt":"2014-09-24T17:31:41.000Z","updatedAt":"2014-09-24T17:31:41.000Z","CompanyId":1,"librariesUser":{"createdAt":"2014-12-01T09:48:21.000Z","updatedAt":"2014-12-01T09:48:21.000Z","UserId":2,"LibraryId":8}},{"id":17,"name":"Sanna's Lib","createdAt":"2014-09-28T14:22:25.000Z","updatedAt":"2014-09-28T14:22:25.000Z","CompanyId":1,"librariesUser":{"createdAt":"2014-12-01T09:48:21.000Z","updatedAt":"2014-12-01T09:48:21.000Z","UserId":2,"LibraryId":17}},{"id":105,"name":"Update Test","createdAt":"2015-05-06T15:55:09.000Z","updatedAt":"2015-05-06T15:55:09.000Z","CompanyId":1,"librariesUser":{"createdAt":"2015-08-29T14:59:36.000Z","updatedAt":"2015-08-29T14:59:36.000Z","UserId":2,"LibraryId":105}}]},{"id":3,"login":"demo3","type":"mobile","name":"Demo user3","libraries":[{"id":8,"name":"imageTest","createdAt":"2014-09-24T17:31:41.000Z","updatedAt":"2014-09-24T17:31:41.000Z","CompanyId":1,"librariesUser":{"createdAt":"2014-12-01T09:48:21.000Z","updatedAt":"2014-12-01T09:48:21.000Z","UserId":3,"LibraryId":8}},{"id":17,"name":"Sanna's Lib","createdAt":"2014-09-28T14:22:25.000Z","updatedAt":"2014-09-28T14:22:25.000Z","CompanyId":1,"librariesUser":{"createdAt":"2014-12-01T09:48:21.000Z","updatedAt":"2014-12-01T09:48:21.000Z","UserId":3,"LibraryId":17}},{"id":105,"name":"Update Test","createdAt":"2015-05-06T15:55:09.000Z","updatedAt":"2015-05-06T15:55:09.000Z","CompanyId":1,"librariesUser":{"createdAt":"2015-08-29T14:59:36.000Z","updatedAt":"2015-08-29T14:59:36.000Z","UserId":3,"LibraryId":105}},{"id":132,"name":"Upload TEST","createdAt":"2015-05-14T07:57:52.000Z","updatedAt":"2015-05-14T07:57:52.000Z","CompanyId":1,"librariesUser":{"createdAt":"2015-05-14T08:02:27.000Z","updatedAt":"2015-05-14T08:02:27.000Z","UserId":3,"LibraryId":132}}]},{"id":10,"login":"testtest","type":"admin","name":"Username test","libraries":[{"id":8,"name":"imageTest","createdAt":"2014-09-24T17:31:41.000Z","updatedAt":"2014-09-24T17:31:41.000Z","CompanyId":1,"librariesUser":{"createdAt":"2014-12-01T09:48:21.000Z","updatedAt":"2014-12-01T09:48:21.000Z","UserId":10,"LibraryId":8}},{"id":17,"name":"Sanna's Lib","createdAt":"2014-09-28T14:22:25.000Z","updatedAt":"2014-09-28T14:22:25.000Z","CompanyId":1,"librariesUser":{"createdAt":"2014-12-01T09:48:21.000Z","updatedAt":"2014-12-01T09:48:21.000Z","UserId":10,"LibraryId":17}},{"id":105,"name":"Update Test","createdAt":"2015-05-06T15:55:09.000Z","updatedAt":"2015-05-06T15:55:09.000Z","CompanyId":1,"librariesUser":{"createdAt":"2015-08-29T15:45:15.000Z","updatedAt":"2015-08-29T15:45:15.000Z","UserId":10,"LibraryId":105}}]},{"id":19,"login":"testUser","type":"admin","name":"testUser","libraries":[{"id":8,"name":"imageTest","createdAt":"2014-09-24T17:31:41.000Z","updatedAt":"2014-09-24T17:31:41.000Z","CompanyId":1,"librariesUser":{"createdAt":"2014-12-01T09:48:21.000Z","updatedAt":"2014-12-01T09:48:21.000Z","UserId":19,"LibraryId":8}},{"id":17,"name":"Sanna's Lib","createdAt":"2014-09-28T14:22:25.000Z","updatedAt":"2014-09-28T14:22:25.000Z","CompanyId":1,"librariesUser":{"createdAt":"2014-12-01T09:48:21.000Z","updatedAt":"2014-12-01T09:48:21.000Z","UserId":19,"LibraryId":17}}]},{"id":159,"login":"demo4","type":"admin","name":"Test for Libs","libraries":[{"id":8,"name":"imageTest","createdAt":"2014-09-24T17:31:41.000Z","updatedAt":"2014-09-24T17:31:41.000Z","CompanyId":1,"librariesUser":{"createdAt":"2015-08-29T13:24:20.000Z","updatedAt":"2015-08-29T13:24:20.000Z","UserId":159,"LibraryId":8}}]},{"id":222,"login":"IanLawrence","type":"admin","name":"IanLawrence","libraries":[]},{"id":266,"login":"asasas","type":"admin","name":"1212","libraries":[]},{"id":269,"login":"zxcvbn","type":"owner","name":"dfjkll","libraries":[]},{"id":270,"login":"1","type":"admin","name":"1","libraries":[]}];

  render() {
    return (<div className={style.usersHolder}>
      <h1 className={style.header}>Users</h1>
      <IconButton icon="fa fa-plus" tooltipText="Add new user" handleClick={this.handleAddUserClick} />
      <Table ref="table" config={this.config} data={this.data} onRowClick={::this.onRowClick}/>
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