import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { loadLibraries } from 'actions';
import DocumentTitle from 'components/DocumentTitle';
import Modal from 'components/Modal';
import Table from 'components/Table';
import IconButton from 'components/IconButton';
import Button from 'components/Button';
import Footer from 'components/Footer';
import loading from 'decorators/loading';

import common from 'common/styles.css';
import styles from './index.css';

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
    this.state = {
      libraries: [],
    };
    props.loadLibraries();
  }

  onListSelectionChange(libraries) {
    this.setState({ libraries });
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

  openNewLibraryPopup() {
    this.setState({isNewLibraryPopupOpen: true});
  }

  hideNewLibraryPopup() {
    this.setState({isNewLibraryPopupOpen: false});
  }

  renderNewLibraryPopup() {
    return (<Modal
      isOpen={this.state.isNewLibraryPopupOpen}
      title="New Library"
      className={styles.newLibraryModal}
    >
      <label className>
        Name:
        <input type="text" placeholder="i.e. English" autoFocus />
      </label>
      <Footer>
        <Button icon="fa fa-check" onClick={::this.hideNewLibraryPopup}>Ok</Button>
        <Button icon="fa fa-ban" onClick={::this.hideNewLibraryPopup}>Cancel</Button>
      </Footer>
    </Modal>);
  }

  render() {
    return (<div>
      <DocumentTitle title="Libraries" />
      { this.renderNewLibraryPopup() }
      <h1>
        Libraries
        <IconButton
          className={common.headerButton}
          onClick={::this.openNewLibraryPopup}
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
        onSelectionChange={::this.onListSelectionChange}
      />
      <Footer>
        <Button
          disabled={!this.state.libraries.length}
          icon="fa fa-trash-o"
          onClick=""
        >
          Delete
        </Button>
        <Button
          icon="fa fa-user"
          onClick=""
        >
          Invite users
        </Button>
      </Footer>
    </div>);
  }
}

export default LibrariesPage;
