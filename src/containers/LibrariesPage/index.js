import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadLibraries } from '../../actions';
import Table from '../../components/Table';
import LoadingSpinner from '../../components/LoadingSpinner';
import {boldTextRender} from '../../components/Table/renders.js';

@connect(
  (state) => ({libraries: state.libraries}),
  (dispatch) => bindActionCreators({ loadLibraries}, dispatch)
)
export default class LibrariesPage extends Component {
  static propTypes = {
    libraries: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    props.loadLibraries();
  }

  onRowClick() {

  }

  config = {
    columns: [
      {
        key: 'name',
        render: boldTextRender,
      }, {
        key: 'folder',
        icon: 'fa fa-folder-open',
        text: 'Folder',
      }, {
        key: 'media',
        icon: 'fa fa-file',
        text: 'Media',
      }, {
        key: 'views',
        icon: 'fa fa-eye',
        text: 'Views',
      },
    ],
    noCheck: true,
  }

  render() {
    return (<div>
      <span>Librares</span>
      <LoadingSpinner loading={this.props.libraries.loading}>
        <Table ref="table" config={this.config} data={this.props.libraries.entities} onRowClick={::this.onRowClick} />
      </LoadingSpinner>
    </div>);
  }
}
