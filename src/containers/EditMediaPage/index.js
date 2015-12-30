import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import loading from 'decorators/loading';
import * as actions from 'actions/media';
import * as folderActions from 'actions/folders';
import Button from 'components/Button';
import Footer from 'components/Footer';
import { baseUrl } from '../../api/helper';

import styles from './index.css';

@connect(
  (state) => ({activeMedia: state.activeMedia.entities, pendingActions: state.pendingActions}),
  (dispatch) => bindActionCreators(Object.assign({}, actions, folderActions), dispatch)
)
@loading(
  (state) => state.activeMedia.loading,
  { isLoadingByDefault: true }
)
export default class EditMediaPage extends Component {
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
    props.loadMedia(props.params.itemId);
    this.getImages(props.params.itemId, 1);

    this.state = {
      loading: true,
      activeMedia: {},
      allPreview: [],
    };
  }

  componentWillReceiveProps(props) {
    if(props.activeMedia && props.activeMedia.name) {
      this.setState({
        activeMedia: props.activeMedia,
        currentMediaName: props.activeMedia.name,
      });
    }

    if (props.params.itemId !== this.props.params.itemId) {
      props.loadMedia(props.params.itemId);
      this.getImages(props.params.itemId, 1);
      this.setState({
        imageError: '',
      });
    }
  }

  cancelSave() {
    this.context.router.transitionTo('folder', {folderId: this.props.params.folderId});
  }

  onMediaInputChange(field, e) {
    this.setState({
      activeMedia: {
        ...this.state.activeMedia,
      [field]: e.target.value,
      },
    });
  }

  async saveNewMedia(e) {
    e.preventDefault();
    await this.props.editMedia(this.state.activeMedia.id, {
       name: this.state.activeMedia.name,
       links: this.state.activeMedia.links,
       description: this.state.activeMedia.description,
    });
    this.props.loadFoldersList(this.props.params.folderId);
    this.props.loadMedia(this.props.params.itemId);
  }

  getImages(itemId, number) {
    const img = new Image();
    img.src = baseUrl + '//preview/' + itemId + '-' + number + '.png';

    img.onload = (e) => {
      this.state.allPreview.push({link: img.src, itemId: itemId, number: number});

      this.getImages(itemId, number + 1);
    };
  }

 async handlerUploadImage(e) {
   const formData = new FormData(e.target.form);
   if(e.target.files[0].type.indexOf('png') === -1 ) {
     this.setState({
       imageError: 'You try to upload incorrect image. Please, use png image',
     });
     return;
   }

   if (e.target.files[0].name) {
     await this.props.uploadImage(this.props.params.itemId, formData);
     this.setState({
       currentImageTime: new Date().getTime(),
       imageError: '',
     });
   }
 }

  async changeCurrentPreview(item) {
    await this.props.changeImage(item.itemId + '-' + item.number + '.png', item.itemId + '.png');
    this.props.loadMedia(this.props.params.itemId);
    this.setState({
      currentImageTime: new Date().getTime(),
      imageError: '',
    });
  }

  setAllImages(id) {
    const classesSpin = cx({
      'fa': true,
      'fa-spin': true,
      'fa-cog': true,
      [styles.hiddenUpload]: !this.props.pendingActions.changeMediaPreview,
      [styles.showUpload]: this.props.pendingActions.changeMediaPreview,
    });
    const classesUploadButton = cx({
      [styles.importContainer]: true,
      [styles.hiddenUpload]: this.props.pendingActions.changeMediaPreview,
    });
    return (
      <div>
        <img className={styles.currentImage} src={`${baseUrl}//preview/${id}.png?time=${this.state.currentImageTime}`} />

        <div className={styles.wrapLabel}>
          <input type="file" name="file" title="Add new image for media" className={styles.inputFile} id="inputFileImageUpload" onChange={::this.handlerUploadImage} ref="fileInputEditMedia" tabIndex="0" />
          <label className={classesUploadButton} htmlFor="inputFileImageUpload">
            Upload preview
          </label>
          <div className={styles.imageError}>{this.state.imageError}</div>
          <div className={classesSpin}></div>
        </div>

        {this.state.allPreview.map((item) => {
          return <img className={styles.currentImage} src={item.link} onClick={this.changeCurrentPreview.bind(this, item)} />;
        })}

      </div>
    );
  }

  render() {
    return (
      <div>
        <div className={styles.toolbar} id="downloaded">
          <span className={styles.toolbarTitle} onClick={::this.cancelSave}>{this.state.currentMediaName}</span>
        </div>
          <div className={styles.mediaForm}>
            <form className={styles.formBody} onSubmit={::this.saveNewMedia}>
              <label className={styles.label} htmlFor="inputMediaField">Name</label>
              <input
                className={styles.inputName}
                name="name"
                placeholder="i.e. John Doe"
                type="text"
                id="inputMediaField"
                value={this.state.activeMedia.name}
                onChange={this.onMediaInputChange.bind(this, 'name')}
                />

              <label className={styles.typeLabel} htmlFor="mediaType">Type:</label>
              <span className={styles.typeName} id="mediaType" tabIndex="0">{this.state.activeMedia.type}</span>

              <label className={styles.label} htmlFor="mediaDescription">Description</label>
              <textarea
                className={styles.descriptionArea}
                id="mediaDescription"
                name="description"
                placeholder="description text"
                value={this.state.activeMedia.description}
                onChange={this.onMediaInputChange.bind(this, 'description')}
                ></textarea><br />

              <label className={styles.label} htmlFor="mediaExternalLinks">External links</label>
              <textArea
                id="mediaExternalLinks"
                className={styles.descriptionArea}
                name="links"
                placeholder="http://"
                value={this.state.activeMedia.links}
                onChange={this.onMediaInputChange.bind(this, 'links')}
                ></textArea><br />

              <div>
                {this.state.activeMedia.id ? this.setAllImages(this.state.activeMedia.id) : ''}
              </div>

              <Footer>
                <Button
                  disabled={!this.state.activeMedia.name.length}
                  className="mdl2-check-mark"
                  onClick={::this.saveNewMedia}
                  tooltipText="Save media"
                  >
                </Button>
                <Button
                  className="mdl2-cancel"
                  onClick={::this.cancelSave}
                  tooltipText="Cancel save media"
                  >
                </Button>
              </Footer>
            </form>
          </div>
        </div>
    );
  }
}

