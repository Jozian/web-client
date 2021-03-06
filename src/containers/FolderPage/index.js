import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListView, reactRenderer as winjsReactRenderer } from 'react-winjs';
import { Link } from 'react-router';
import { RouteHandler } from 'react-router';
import cx from 'classnames';

import loading from 'decorators/loading';
import wrapper from 'decorators/listManager';
import Modal from 'components/Modal';
import ActionButtonForModal from 'components/ActionButtonForModal';
import * as actions from 'actions/folders';
import Header from 'components/Header';
import Button from 'components/Button';
import PreviewImage from 'components/PreviewImage';
import LoadingSpinner from 'components/LoadingSpinner';
import Footer from 'components/Footer';
import WhiteFooter from 'components/WhiteFooter';
import { listLayout } from 'common';
import { onEnterPressed } from '../../common';
import { isInputField } from '../../common';

import styles from './index.css';
import commonStyles from 'common/styles.css';

@connect(
  (state) => ({folder: state.activeFolder, folderList: state.activeFolder.entity.data, user: state.currentUser, pendingActions: state.pendingActions, clientError: state.clientError, imageUploaded: state.changeMediaImage}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
@wrapper(['folderList'])
@loading(
  (state) => state.folder.loading,
  { isLoadingByDefault: true }
)
export default class FolderPage extends Component {
  static propTypes = {
    folder: React.PropTypes.object.isRequired,
    createFolder: React.PropTypes.func.isRequired,
    params: React.PropTypes.shape({
      folderId: React.PropTypes.string.isRequired,
      itemId: React.PropTypes.string,
      itemType: React.PropTypes.string,
    }),
  };

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    props.loadFoldersList(props.params.folderId);
    this.handleKeyDown = ::this._handleKeyDown;
    this.state = {
      selection: [],
      selectOnLoad: true,
      folder: {
        name: '',
      },
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
    if (props.params.itemId) {
      this.setState({selection: [props.params.itemId]});
      this.setState({selectOnLoad: true});
    }
  }

  componentDidUpdate() {
    if (this.props.params.itemId && this.state.selectOnLoad) {
      this.props.folder.entity.data.forEach((data, index) => {
        if (data.id && data.id.toString() === this.props.params.itemId && data.type === this.props.params.itemType) {
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
    if (e.keyCode === 13 && this.refs.inputAsk && this.refs.inputAsk.getDOMNode() === e.target) {
      this.onChangeCheckbox(this.refs.inputAsk.getDOMNode());
    }
    if (this.state.isOpenNewMediaModal || this.state.isOpenEditFolderModal
      || this.state.isOpenDeleteFoldersModal || isInputField(e)) {
      return;
    }
    const key = String.fromCharCode(e.keyCode);
    if (key === 'A' && e.ctrlKey) {
      e.preventDefault();
      this.refs.folder.winControl.selection.selectAll();
    }
    if (e.keyCode === 27 ) {
      this.refs.folder.winControl.selection.clear();
    }
    if (e.keyCode === 46) {
      this.openDeleteFoldersModal();
    }
  }

  openEditFolderModal(folder, e) {
    this.setState({
      folder: {id: folder.id, name: folder.name},
      newFolderName: folder.name,
      isOpenEditFolderModal: true,
    });
    clearTimeout(window.timer);
    e.stopPropagation();
  }

  hideEditFolderModal() {
    this.setState({
      isOpenEditFolderModal: false,
    });
  }

  folderItemRenderer = winjsReactRenderer((item) => {
    const renderMediaItem = (media) => (
      <div className={styles.listItem}>
        <PreviewImage
          className={styles.image}
          src={`${media.picture}?timestamp=${media.timeStamp}`}
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
        <button
          disabled={this.props.user.CompanyId !== this.props.folder.entity.companyId}
          title={`Edit folder ${folder.name}`}
          className={cx("fa fa-pencil win-interactive", styles.editFolderButton)}
          onClick={this.openEditFolderModal.bind(this, folder)}
          onKeyDown={onEnterPressed(this.openEditFolderModal.bind(this, folder))}
          tabIndex="0"
        ></button>
      </div>
    );

    return (item.data.type === 'folder'
      ? renderFolderItem
      : renderMediaItem
    )(item.data);
  });

  async handleItemSelected(event) {
    const item = await event.detail.itemPromise;
    window.timer = setTimeout(() => {
      const activeItemId = this.props.params.itemId;
      const goTo = ::this.context.router.transitionTo;

      if (item.data.type === 'media' &&
        this.props.user.CompanyId !== this.props.folder.entity.companyId) {
        return;
      }

      switch (item.data.type) {
        case 'folder':
          if (activeItemId === item.data.id.toString()) {
            goTo('folder', {folderId: activeItemId});
          } else {
            goTo('folderSelection', {
              folderId: this.props.params.folderId,
              itemType: 'folder',
              itemId: item.data.id.toString(),
            });
          }
          break;
        case 'media':
          goTo('mediaSelection', {
            folderId: this.props.params.folderId,
            itemType: 'media',
            itemId: item.data.id.toString(),
          });
          break;
        default:
          throw new Error('Unsupported item type');
      }
    }, 0);
  }

  async handleSelectionChange(e) {
    const items = await e.target.winControl.selection.getItems();

    this.setState({
      selection: items.map( (item) => (item.data)),
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
          (<li className={styles.breadcrumbName}>
            <span className={styles.spanWrapper}>
              <Link className={styles.breadcrumbsLink} to="folder" key={pathEntry.id} params={{folderId: pathEntry.id}}>
                {pathEntry.title}
              </Link>
              <span className={styles.breadcrumbsTooltip}>{pathEntry.title}</span>
            </span>
          </li>)
        )
      }
    </ul>);
  }

  onFolderNameInputChange(e) {
    this.setState({
      newFolderName: e.target.value,
    });
  }

  async updateFolder() {
    await this.props.updateFolder({id: this.state.folder.id.toString(), name: this.state.newFolderName});
    this.hideEditFolderModal();
    this.props.loadFoldersList(this.props.params.folderId);
  }

  renderEditFolder() {
    return (
      <Modal
        isOpen={this.state.isOpenEditFolderModal}
        title="New folder name"
        className={styles.editFolderModal}
        >

          <form onSubmit={::this.updateFolder}>
            <label className={styles.hideLabel} htmlFor="inputNewName">New folder name:</label>
            <input
              label="New folder name"
              name="name"
              placeholder="Media name"
              type="text"
              id="inputNewName"
              value={this.state.newFolderName}
              onChange={::this.onFolderNameInputChange}
              className={styles.editInput} />
          </form>

          <WhiteFooter>
            <ActionButtonForModal
              className={commonStyles.saveButtonModal}
              onClick={::this.updateFolder}
              >
              Save
            </ActionButtonForModal>
            <ActionButtonForModal className={commonStyles.cancelButtonModal}  onClick={::this.hideEditFolderModal}>Cancel</ActionButtonForModal>
          </WhiteFooter>

      </Modal>);
  }

  renderEditMedia() {
    return (
      <div className={styles.column} style={{backgroundColor: 'blue'}}>
        <LoadingSpinner loading={true} />
        <Footer>
          <Button icon="fa fa-save">Save</Button>
        </Footer>
      </div>
    );
  }

  renderItemList() {
    return (<div>
      <ListView
        key="folder"
        ref="folder"
        className={styles.list}
        itemDataSource={this.props.folderList.dataSource}
        itemTemplate={this.folderItemRenderer}
        onItemInvoked={::this.handleItemSelected}
        onSelectionChanged={::this.handleSelectionChange}
        layout={listLayout}
      />
      <Footer>
        <Button
          disabled={this.state.selection.length === 0 ||
           this.props.user.CompanyId !== this.props.folder.entity.companyId}
          className="mdl2-delete"
          onClick={::this.openDeleteFoldersModal}
          tooltipText="Remove element"
        >
        </Button>
      </Footer>
    </div>);
  }

  async addDefaultFolder() {
    const newFolderData = {
      name: 'Folder',
      parentId: this.props.params.folderId,
    };

    this.props.createFolder(newFolderData).then((data) => {
      this.props.loadFoldersList(this.props.params.folderId);
      this.context.router.transitionTo('folderSelection', {
        folderId: this.props.params.folderId,
        itemType: 'folder',
        itemId: data.payload.id,
      });
    });
  }

  openDeleteFoldersModal() {
    this.setState({isOpenDeleteFoldersModal: true});
  }

  hideDeleteFoldersPopup() {
    this.setState({isOpenDeleteFoldersModal: false});
  }

  openNewMediaModal() {
    this.setState({isOpenNewMediaModal: true});
  }

  openModalAfterMediaUpload() {
    this.setState({isOpenModalAfterMediaUpload: true});
  }

  hideModalAfterMediaUpload() {
    this.changeSetting();
    this.setState({isOpenModalAfterMediaUpload: false});
  }

  changeSetting() {
    if (this.state.showPopupAfterMediaLoading) {
      this.props.setDontAsk();
    }
  }

  hideNewMediaModal() {
    this.setState({
      isOpenNewMediaModal: false,
      newMedia: {},
      selectedFileName: '',
      uploadFileData: undefined,
      isTypeValid: false,
      currentType: '',
      progress: '0%',
      showErrorCreateMedia: false,
    });
  }

  errorHandler(evt) {
    switch (evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
      alert('File Not Found!');
      break;
    case evt.target.error.NOT_READABLE_ERR:
      alert('File is not readable');
      break;
    case evt.target.error.ABORT_ERR:
      break;
    default:
      alert('An error occurred reading this file.');
    }
  }

  async handlerUploadFile(e) {

    this.setState({
      progress: '0%',
      showErrorCreateMedia: false,
    });

    const reader = new FileReader();
    reader.onerror = this.errorHandler;
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentLoaded = Math.round((e.loaded / e.total) * 100);
        if (percentLoaded < 100) {
          this.setState({
            progress: percentLoaded + '%',
          });
        }
      }
    };

    reader.onload = (e) => {
      this.setState({
        progress: '100%',
      });
    };

    const isTypeValid = this.isValidType(e.target.files[0].type);
    let currentType;
    if (isTypeValid) {
      currentType = this.getType(e.target.files[0].type);
      this.setState({
        selectedFileName: e.target.files[0].name,
        uploadFileData: new FormData(e.target.form),
        isTypeValid: isTypeValid,
        currentType: currentType,
      });
      reader.readAsArrayBuffer(e.target.files[0]);
    } else {
      this.setState({
        currentType: 'Invalid file type.',
      });
    }
  }

  isValidType(fileType) {
    const type = fileType.toLowerCase();
    if (type.search('image') !== -1 ) {
      return true;
    }
    if (type.search('video') !== -1) {
      return true;
    }
    if (type.search('text/plain') !== -1) {
      return true;
    }
    return false;
  }

  getType(type) {
    if (type.search('video') !== -1 ) {
      return 'video';
    }
    if (type.search('image') !== -1) {
      return 'image';
    }
    if (type.search('text') !== -1) {
      return 'text';
    }
  }

  async addMedia() {
    this.state.uploadFileData.append('FolderId', this.props.params.folderId);

    for (const key in this.state.newMedia) {
      this.state.uploadFileData.append(key, this.state.newMedia[key]);
    }
    const resMediaUpload = await this.props.uploadMedia(this.state.uploadFileData);

    if (resMediaUpload) {
      this.hideNewMediaModal();
      this.props.loadFoldersList(this.props.params.folderId);

      if (!this.props.user.hideInvitePopup) {
        this.openModalAfterMediaUpload();
      }
    } else {
      this.hideNewMediaModal();
    }
  }

  async deleteFolders() {
    if (this.state.selection.length === 0) {
      return;
    }

    await this.props.deleteFolders(this.state.selection.map(l => ({id: l.id, type: l.type})));
    this.hideDeleteFoldersPopup();
    this.setState({selection: []});
    this.context.router.transitionTo('folder', {
      folderId: this.props.params.folderId.toString(),
    });
    this.props.loadFoldersList(this.props.params.folderId);
  }

  onChangeCheckbox(e) {
    e.checked = !e.checked;
    this.setState({
      showPopupAfterMediaLoading: e.checked,
    });
  }

  redirectToLibrary() {
    this.context.router.transitionTo('libraries');
    this.hideModalAfterMediaUpload();
  }

  renderAddMediaModal() {
    return (
      <Modal
        isOpen={this.state.isOpenNewMediaModal}
        title="New media"
        className={styles.newLibraryModal}
        >
        <div>
          <form className={styles.addMediaForm}>
            <div className={styles.inprogressLine} style={{width: this.state.progress}}></div>
            <label className={styles.editLabel} htmlFor="inputName">Name:</label>
            <input
              label="Media name"
              name="name"
              placeholder="Media name"
              type="text"
              maxLength="30"
              id="inputName"
              onChange={this.onChange.bind(this, 'name')}
              className={styles.editInput} />

            <div className={styles.wrapLabel}>
              <input type="file" name="file" title="upload media file" className={styles.inputFile} id="addMediaLabel" onChange={::this.handlerUploadFile} ref="fileInput" tabIndex="0"/>
              <label className={styles.importContainer} tabIndex="-1" htmlFor="addMediaLabel">
                Upload file
              </label>
              <div className={styles.errorUploadMedia}>{this.state.showErrorCreateMedia ? 'File upload error, please retry.' : ''}</div>
            </div>

            <div className={styles.videoType}>Type: {this.state.currentType === 'Invalid file type.' ? <div className={styles.mediaTypeError}>{this.state.currentType}</div> : <div className={styles.mediaType}>{this.state.currentType}</div>}</div>

            <label className={styles.descriptionName} htmlFor="descriptionField">Description:</label>
            <textArea
              type="text"
              placeholder="i.e. English"
              className={styles.textArea}
              onChange={this.onChange.bind(this, 'description')}
              id="descriptionField"
              ></textArea>
            <label className={styles.editLabel} htmlFor="externalLinks">External links:</label>
            <textArea
              label="External links"
              name="links"
              placeholder="External links"
              type="text"
              onChange={this.onChange.bind(this, 'links')}
              className={cx(styles.textArea, styles.marginBottomForArea)}
              id="externalLinks"></textArea>
          </form>
        </div>

        <WhiteFooter>
          <ActionButtonForModal
            className={commonStyles.saveButtonModal}
            onClick={::this.addMedia}
            inProgress={this.props.pendingActions.addMedia}
            disabled={!this.state.isTypeValid || !this.state.newMedia || !this.state.newMedia.name.length || this.state.progress !== '100%'}
            >
            Save
          </ActionButtonForModal>
          <ActionButtonForModal className={commonStyles.cancelButtonModal}  onClick={::this.hideNewMediaModal}>Cancel</ActionButtonForModal>
        </WhiteFooter>
      </Modal>);
  }


  renderModalAfterMediaUpload() {
    return (<Modal
      isOpen={this.state.isOpenModalAfterMediaUpload}
      className={styles.newLibraryModal}
      >
      <div className={styles.popupBody}>
        <div>Media items should be shared with users before they can see them on mobile client.
        You can do it on the 'Libraries' tab with the help of 'Invite Users' button. Do you want to do it now?</div>

        <input ref="inputAsk" id="labelDontAsk" role="checkbox" className={styles.inputDontAsk} onClick={::this.onChangeCheckbox} type="checkbox" tabIndex="0"/> <label htmlFor="labelDontAsk" className={styles.dontAskLabel}>Don't ask again.</label>
      </div>
      <WhiteFooter>
        <ActionButtonForModal
          className={commonStyles.saveButtonModal}
          onClick={::this.redirectToLibrary}
          >
          Ok
        </ActionButtonForModal>
        <ActionButtonForModal className={commonStyles.cancelButtonModal}  onClick={::this.hideModalAfterMediaUpload}>Cancel</ActionButtonForModal>
      </WhiteFooter>
    </Modal>);
  }

  renderDeleteFoldersModal() {
    return (<Modal
      isOpen={this.state.isOpenDeleteFoldersModal}
      title="Are you sure you want to delete selected items?"
      className={styles.newLibraryModal}
      >
      <WhiteFooter>
        <ActionButtonForModal
          className={commonStyles.saveButtonModal}
          onClick={::this.deleteFolders}
          >
          Ok
        </ActionButtonForModal>
        <ActionButtonForModal className={commonStyles.cancelButtonModal}  onClick={::this.hideDeleteFoldersPopup}>Cancel</ActionButtonForModal>
      </WhiteFooter>
    </Modal>);
  }

  onChange(field, e) {
    this.setState({
      newMedia: {
        ...this.state.newMedia,
      [field]: e.target.value,
      },
    });
  }

  render() {
    return (
    <div>
      { this.renderDeleteFoldersModal() }
      { this.renderAddMediaModal() }
      { this.renderEditFolder() }
      { this.renderModalAfterMediaUpload() }
      <Header>{this.props.folder.entity.name}
        <Button
          disabled={this.props.user.CompanyId !== this.props.folder.entity.companyId}
          className="mdl2-document"
          onClick={::this.openNewMediaModal}
          tooltipText="Add new media"></Button>
        <Button
          disabled={this.props.user.CompanyId !== this.props.folder.entity.companyId}
          className="mdl2-new-folder"
          onClick={::this.addDefaultFolder}
          tooltipText="Add new folder"
        ></Button>

      </Header>
      { this.renderBreadcrumbs() }
      <div className={styles.column}>
        { this.renderItemList() }
      </div>
      <div className={styles.column}>
        <RouteHandler />
      </div>
    </div>);
  }
}
