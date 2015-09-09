import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListView, reactRenderer as winjsReactRenderer } from 'react-winjs';
import { Link } from 'react-router';
import cx from 'classnames';

import winjsBind from 'decorators/winjsBind';
import loading from 'decorators/loading';
import { loadFoldersList } from 'actions/folders';
import Header from 'components/Header';
import Button from 'components/Button';
import IconButton from 'components/IconButton';
import PreviewImage from 'components/PreviewImage';
import LoadingSpinner from 'components/LoadingSpinner';
import Footer from 'components/Footer';
import commonStyles from 'common/styles.css';
import { listLayout } from 'common';

import styles from './index.css';

@connect(
  (state) => ({folder: state.activeFolder}),
  (dispatch) => bindActionCreators({ loadFoldersList }, dispatch)
)
@winjsBind(
  (props) => ({
    items: props.folder.entity.data,
  })
)
@loading(
  (state) => state.folder.loading,
  { isLoadingByDefault: true }
)
export default class FolderPage extends Component {
  static propTypes = {
    folder: React.PropTypes.object.isRequired,
    params: React.PropTypes.shape({
      folderId: React.PropTypes.string.isRequired,
      itemId: React.PropTypes.string,
    }),
    items: React.PropTypes.shape({
      dataSource: React.PropTypes.object.isRequired,
      forEach: React.PropTypes.func.isRequired,
    }),
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    props.loadFoldersList(props.params.folderId);
    this.handleKeyDown = ::this._handleKeyDown;
    this.state = {
      selection: [],
      selectOnLoad: true,
    };
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillReceiveProps(props) {
    if (props.params.folderId !== this.props.params.folderId) {
      props.loadFoldersList(props.params.folderId);
    }
    if (props.params !== this.props.params) {
      this.setState({selection: []});
      this.setState({selectOnLoad: true});
    }
  }

  componentDidUpdate() {
    if (this.props.params.itemId && this.state.selectOnLoad) {
      this.props.items.forEach((data, index) => {
        if (data.id.toString() === this.props.params.itemId) {
          this.refs.folder.winControl.selection.set(index);
          setImmediate(() => this.refs.folder.winControl.ensureVisible(index));
          this.setState({selectOnLoad: false});
        }
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  _handleKeyDown(e) {
    const key = String.fromCharCode(e.keyCode);
    if (key === 'A' && e.ctrlKey) {
      e.preventDefault();
      this.refs.folder.winControl.selection.selectAll();
    }
    if (e.keyCode === 27 ) {
      this.refs.folder.winControl.selection.clear();
    }
    if (e.keyCode === 46) {
      this.handleDelete();
    }
  }

  folderItemRenderer = winjsReactRenderer((item) => {
    const renderMediaItem = (media) => (
      <div className={styles.listItem}>
        <PreviewImage
          className={styles.image}
          src={'http://www.microsofteducationdelivery.net' + media.picture}
          />
        <div className={styles.name}>{media.name}</div>
      </div>
    );

    const renderFolderItem = (folder) => (
      <div className={styles.listItem}>
        <div className={styles.image}>
          <i className={cx(
              'fa',
              'fa-folder-open',
              styles.folderIcon
            )}
          />
        </div>
        <div className={styles.name}>{folder.name}</div>
      </div>
    );

    return (item.data.type === 'folder'
      ? renderFolderItem
      : renderMediaItem
    )(item.data);
  })

  async handleItemSelected(event) {
    const item = await event.detail.itemPromise;
    const activeItemId = this.props.params.itemId;
    const goTo = ::this.context.router.transitionTo;
    switch (item.data.type) {
    case 'folder':
      if (activeItemId === item.data.id.toString()) {
        goTo('folder', {folderId: activeItemId});
      } else {
        goTo('folderSelection', {
          folderId: this.props.params.folderId,
          itemId: item.data.id.toString(),
        });
      }
      break;
    case 'media':
      goTo('folderSelection', {
        folderId: this.props.params.folderId,
        itemId: item.data.id.toString(),
      });
      break;
    default:
      throw new Error('Unsupported item type');
    }
  }

  async handleSelectionChange(e) {
    const items = await e.target.winControl.selection.getItems();

    this.setState({
      selection: items.map( (item) => (item.data.id)),
    });
  }
  renderBreadcrumbs() {
    const path = [...this.props.folder.entity.path];
    path.push({
      title: this.props.folder.entity.name,
      id: this.props.params.folderId,
    });

    return (<ul className={styles.breadcrumbs}>
      <li><Link to="libraries">Libraries</Link></li>
      {
        path.map((pathEntry) =>
          (<li>
            <Link to="folder" key={pathEntry.id} params={{folderId: pathEntry.id}}>
              {pathEntry.title}
            </Link>
          </li>)
        )
      }
    </ul>);
  }

  renderItemList() {
    return (<div>
      <ListView
        key="folder"
        ref="folder"
        className={styles.list}
        itemDataSource={this.props.items.dataSource}
        itemTemplate={this.folderItemRenderer}
        onItemInvoked={::this.handleItemSelected}
        onSelectionChanged={::this.handleSelectionChange}
        layout={listLayout}
      />,
      <Footer>
        <Button
          disabled={this.state.selection.length === 0}
          icon="fa fa-trash-o"
        >
          Delete
        </Button>
      </Footer>
    </div>);
  }

  render() {
    return (
    <div>
      <Header>{this.props.folder.entity.name}
        <IconButton
          className={commonStyles.headerButton}
          icon="fa fa-file-o"
          tooltipText="Add new media"
        />
        <IconButton
          className={commonStyles.headerButton}
          icon="fa fa-folder-open"
          tooltipText="Add new folder"
        />
      </Header>
      { this.renderBreadcrumbs() }
      <div className={styles.column}>
        { this.renderItemList() }
      </div>
      <div className={styles.column} style={{backgroundColor: 'blue'}}>
        <LoadingSpinner loading={true} />
        <Footer>
          <Button icon="fa fa-save">Save</Button>
        </Footer>
      </div>
    </div>);
  }
}
