import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import loading from 'decorators/loading';
import * as actions from 'actions/media';
import Button from 'components/Button';
import Footer from 'components/Footer';
import FormInput from 'components/Form/FormInput';
import { baseUrl } from '../../api/helper';

import styles from './index.css';

@connect(
  (state) => ({activeMedia: state.activeMedia.entities, pendingActions: state.pendingActions}),
  (dispatch) => bindActionCreators(actions, dispatch)
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
    this.setState({
      activeMedia: props.activeMedia,
      currentMediaName: props.activeMedia.name,
    });

    if (props.params.itemId !== this.props.params.itemId) {
      props.loadMedia(props.params.itemId);
      this.getImages(props.params.itemId, 1);
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

  async saveNewMedia() {
   await this.props.editMedia(this.state.activeMedia.id, {
     name: this.state.activeMedia.name,
     links: this.state.activeMedia.links,
     description: this.state.activeMedia.description,
   });
    this.props.loadMedia(this.props.params.itemId);
  }

  getImages(itemId, number) {
    const img = new Image();
    img.src = '/preview/' + itemId + '-' + number + '.png';

    img.onload = (e) => {
      this.state.allPreview.push({link: img.src, itemId: itemId, number: number});

      this.getImages(itemId, number + 1);
    };
  }

 async handlerUploadImage(e) {
    const formData = new FormData(e.target.form);

    if (e.target.files[0].name) {
     await this.props.uploadImage(this.props.params.itemId, formData);
      this.setState({
        uploadImage: true,
      });
    }
  }

  async changeCurrentPreview (item) {
    await this.props.changeImage(item.itemId + '-' + item.number + '.png', item.itemId + '.png');
    this.props.loadMedia(this.props.params.itemId);
  }

  onUploadFile(e) {
    if (e.keyCode.toString() === '13') {
      React.findDOMNode(this.refs.fileInputEditMedia).click();
    }
  }

  setAllImages(id) {
    return (
      <div>
        <img className={styles.currentImage} src={`${baseUrl}//preview/${id}.png`} />

        <label className={styles.wrapLabel}>
          <input type="file" name="file" className={styles.inputFile} onChange={::this.handlerUploadImage} ref="fileInputEditMedia" />
          <div className={styles.importContainer} role="button" tabIndex="0" onKeyDown={::this.onUploadFile}>Upload preview</div>
        </label>

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
            <form className={styles.formBody}>
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
              <input
                id="mediaExternalLinks"
                className={styles.inputName}
                name="links"
                placeholder="links"
                value={this.state.activeMedia.links}
                onChange={this.onMediaInputChange.bind(this, 'links')}
                /><br />

              <div>
                {this.setAllImages(this.state.activeMedia.id)}
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

