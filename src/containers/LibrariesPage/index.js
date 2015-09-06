import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from 'actions/libraries';
import DocumentTitle from 'components/DocumentTitle';
import Modal from 'components/Modal';
import Table from 'components/Table';
import IconButton from 'components/IconButton';
import ActionButton from 'components/ActionButton';
import Button from 'components/Button';
import Footer from 'components/Footer';
import loading from 'decorators/loading';

import common from 'common/styles.css';
import styles from './index.css';

@connect(
  (state) => ({ libraries: state.libraries, pendingActions: state.pendingActions}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
@loading(
  (state) => state.libraries.loading,
  { isLoadingByDefault: true },
)
class LibrariesPage extends Component {

  static propTypes = {
    libraries: React.PropTypes.object.isRequired,
    pendingActions: React.PropTypes.object.isRequired,
    createLibrary: React.PropTypes.func.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      libraries: [],
      newLibraryName: '',
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
    this.setState({
      newLibraryName: '',
      isNewLibraryPopupOpen: true});
  }

  hideNewLibraryPopup() {
    this.setState({isNewLibraryPopupOpen: false});
  }

  onLibraryNameInputChange(event) {
    this.setState({
      newLibraryName: event.target.value,
    });
  }

  createNewLibrary(event) {
    if (this.props.pendingActions.newLibrary) {
      return;
    }

    if (!this.state.newLibraryName.length) {
      return;
    }

    this.props.createLibrary(this.state.newLibraryName).then(::this.hideNewLibraryPopup);
    event.preventDefault();
  }

  renderNewLibraryPopup() {
    return (<Modal
      isOpen={this.state.isNewLibraryPopupOpen}
      title="New Library"
      className={styles.newLibraryModal}
    >
      <form onSubmit={::this.createNewLibrary}>
          <label className>
          Name:
          <input
            type="text"
            placeholder="i.e. English"
            autoFocus
            value={this.state.newLibraryName}
            onChange={::this.onLibraryNameInputChange}
          />
        </label>
      </form>
      <Footer>
        <ActionButton
          icon="fa fa-check"
          onClick={::this.createNewLibrary}
          disabled={!this.state.newLibraryName.length}
          inProgress={this.props.pendingActions.newLibrary}
        >
          Ok
        </ActionButton>
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
