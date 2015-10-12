import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import loading from 'decorators/loading';
import * as actions from 'actions/folders';
import Button from 'components/Button';
import Footer from 'components/Footer';

import styles from './index.css';

@connect(
  (state) => ({folder: state.folder.entities}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
@loading(
  (state) => state.folder.loading,
  { isLoadingByDefault: true }
)
export default class EditFolderPage extends Component {
  static propTypes = {
    params: React.PropTypes.shape({
      itemId: React.PropTypes.string.isRequired,
    }),
  };

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    props.loadFolder(props.params.itemId);

    this.state = {
      loading: true,
      folder: {},
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      folder: props.folder,
      currentFolderName: props.folder.name,
    });
    if (props.params.itemId !== this.props.params.itemId) {
      props.loadFolder(props.params.itemId);
    }
  }
  onFolderNameInputChange(event) {
    this.setState({
      folder: {
        name: event.target.value,
      },
    });
  }

  async saveNewName() {
    await this.props.updateFolder({id: this.props.params.itemId, name: this.state.folder.name});
    this.setState({
      currentFolderName: this.state.folder.name,
    });
    this.props.loadFoldersList(this.props.params.folderId);
  }

  cancelSave() {
    this.context.router.transitionTo('folder', {
      folderId: this.props.params.folderId.toString(),
    });
  }

  render() {
    return (
      <div className={styles}>
        <div className={styles.toolbar} id="downloaded">
          <span className={styles.toolbarTitle}>Edit {this.state.currentFolderName}</span>
        </div>

        <form >
          <label className={styles.folderNameLabel}>
            Name:
            <input
              type="text"
              placeholder="i.e. English"
              autoFocus
              value={this.state.folder.name}
              onChange={::this.onFolderNameInputChange}
              role="Name for new folder"
              className={styles.folderNameInput}
              />
          </label>

          <Footer>
            <Button
              disabled={!this.state.folder.name.length}
              icon="fa"
              onClick={::this.saveNewName}
              >
              OK
            </Button>
            <Button
              icon="fa"
              onClick={::this.cancelSave}
              >
              Cancel
            </Button>
          </Footer>
        </form>
      </div>
    );
  }
}
