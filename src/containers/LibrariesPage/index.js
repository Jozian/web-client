import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { loadLibraries } from 'actions';
import Table from 'components/Table';
import IconButton from 'components/IconButton';
import common from 'common/styles.css';
import loading from 'decorators/loading';

@connect(
  (state) => ({libraries: state.libraries}),
  (dispatch) => bindActionCreators({ loadLibraries}, dispatch)
)
@loading(
  (state) => state.libraries.loading,
  { isLoadingByDefault: true },
)
class LibrariesPage extends Component {

  static propTypes = {
    libraries: React.PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    props.loadLibraries();
  }

  onRowClick(data) {
    this.context.router.transitionTo('folder', {folderId: data.id});
  }

  config = {
    columns: [
      {
        key: 'name',
      },
      {
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
        Libraries
        <IconButton
          className={common.headerButton}
          icon="fa fa-plus"
          tooltipText="Add new library"
        />
      </h1>
      <Table
        className={common.table}
        ref="table"
        config={this.config}
        data={this.props.libraries.entities}
        onRowClick={::this.onRowClick}
        onSelectionChange={::console.log}
      />
    </div>);
  }
}

export default LibrariesPage;
