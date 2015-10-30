import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import loading from 'decorators/loading';
import * as actions from 'actions/media';
import Button from 'components/Button';
import Footer from 'components/Footer';
import FormInput from 'components/Form/FormInput';

import styles from './index.css';

@connect(
  (state) => ({activeMedia: state.activeMedia.entities}),
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

    this.state = {
      loading: true,
      activeMedia: {},
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      activeMedia: props.activeMedia,
      currentMediaName: props.activeMedia.name,
    });

    if (props.params.itemId !== this.props.params.itemId) {
      props.loadMedia(props.params.itemId);
    }
  }

  cancelSave() {
    this.context.router.transitionTo('folder', {folderId: this.props.params.folderId});
  }

  onMediaNameInputChange(event) {
    this.setState({
      activeMedia: {
        id: this.props.activeMedia.id,
        name: event.target.value,
        type: this.props.activeMedia.type,
        description: this.props.activeMedia.description,
        links: this.props.activeMedia.links,

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

  setAllImages(id) {
    return (
      <img src="/preview/library1.png" />
    );
  }

  render() {
    return (
      <div>
        <div className={styles.toolbar} id="downloaded">
          <span className={styles.toolbarTitle} onClick={::this.cancelSave}>{this.state.currentMediaName}</span>
        </div>
          <div className={styles.mediaForm}>
            <form>
              <label className={styles.label}>Name</label>
              <input
                className={styles.inputName}
                name="name"
                placeholder="i.e. John Doe"
                type="text"
                value={this.state.activeMedia.name}
                onChange={::this.onMediaNameInputChange}
                />

              <label className={styles.typeLabel}>Type:</label>
              <span className={styles.typeName}>{this.state.activeMedia.type}</span>

              <label className={styles.label}>Description</label>
              <textarea
                className={styles.descriptionArea}
                name="description"
                placeholder="description text"
                value={this.state.activeMedia.description}
                ></textarea><br />

              <label className={styles.label}>External links</label>
              <input
                className={styles.inputName}
                name="links"
                placeholder="links"
                value={this.state.activeMedia.links}
                /><br />

              <div>
                {this.setAllImages(this.state.activeMedia.id)}
              </div>


              <Footer>
                <Button
                  disabled={!this.state.activeMedia.name.length}
                  className="mdl2-check-mark"
                  onClick={::this.saveNewMedia}
                  >
                </Button>
                <Button
                  className="mdl2-cancel"
                  onClick={::this.cancelSave}
                  >
                </Button>
              </Footer>
            </form>

          </div>
        </div>
    );
  }
}

