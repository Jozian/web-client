import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { loadLibraries } from '../../actions';
import Table from '../../components/Table';
import IconButton from '../../components/IconButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import {boldTextRender} from '../../components/Table/renders.js';
import common from '../../common/styles.css';

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
    this.state = { loading: true };
  }

  componentWillUpdate(props) {
    if (props === this.props) {
      return;
    }

    this.setState({ loading: props.libraries.loading});
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
    selectable: true,
  }

  render() {
    return (<div>
      <h1>
        Librares
        <IconButton
          className={common.headerButton}
          icon="fa fa-plus"
          tooltipText="Add new library"
        />
      </h1>
      <LoadingSpinner loading={this.state.loading}>
        <Table
          className={common.table}
          ref="table"
          config={this.config}
          data={this.props.libraries.entities}
          onRowClick={::this.onRowClick}
        />
      </LoadingSpinner>
    </div>);
  }
}
