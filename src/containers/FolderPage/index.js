import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListView, reactRenderer as winjsReactRenderer } from 'react-winjs';
import { Link } from 'react-router';
import cx from 'classnames';

import winjsBind from 'decorators/winjsBind';
import loading from 'decorators/loading';
import { loadFoldersList } from 'actions/folders';
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
  }

  componentWillReceiveProps(props) {
    if (props.params.folderId !== this.props.params.folderId) {
      props.loadFoldersList(props.params.folderId);
    }
  }

  componentDidUpdate() {
    if (this.props.params.itemId) {
      this.props.items.forEach((data, index) => {
        if (data.id.toString() === this.props.params.itemId) {
          this.refs.folder.winControl.selection.set(index);
          setImmediate(() => this.refs.folder.winControl.ensureVisible(index));
        }
      });
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
            <Link to="folder" params={{folderId: pathEntry.id}}>
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
        layout={listLayout}
      />,
      <Footer />
    </div>);
  }

  render() {
    return (
      <div>
        <h1>{this.props.folder.entity.name}
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
      </h1>
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
