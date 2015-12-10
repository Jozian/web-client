import React, { Component } from 'react';
import { ListView, reactRenderer as winjsReactRenderer } from 'react-winjs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions/media-comments';
import Modal from 'components/Modal';
import loading from 'decorators/loading';
import ActionButton from 'components/ActionButton';
import ActionButtonForModal from 'components/ActionButtonForModal';
import Footer from 'components/Footer';
import WhiteFooter from 'components/WhiteFooter';
import Header from 'components/Header';
import cx from 'classnames';
import { onEnterPressed } from '../../common';

import style from './style.css';
import commonStyles from 'common/styles.css';

@connect(
    (state) => ({comments: state.activeComment, user: state.currentUser, pendingActions: state.pendingActions}),
    (dispatch) => bindActionCreators(actions, dispatch)
)
@loading(
  (state) => state.comments.loading,
  { isLoadingByDefault: true }
)
export default class CommentDetails extends Component {

  static propTypes = {
    comments: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    deleteComments: React.PropTypes.func.isRequired,
    pendingActions: React.PropTypes.object.isRequired,
    createComment: React.PropTypes.func.isRequired,
    loadComments: React.PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);

    props.loadComments(this.props.params.id);
    this.handleKeyDown = ::this._handleKeyDown;
    this.state = {
      loading: true,
      modalWindow: {},
      selectionComments: [],
      selectOnLoad: '',
      selectItem: {},
      newCommentText: '',
    };
  }

  componentWillReceiveProps(props) {
    if (props === this.props) {
      return;
    }
    this.setState({ loading: props.comments.loading});
  }

  onCommentTextInputChange(event) {
    this.setState({
      newCommentText: event.target.value,
    });
  }

  replyAll() {
    this.setState({
      isNewCommentPopupOpen: true,
      modalWindow: {
        title: `To ${ this.props.params.mediaName }`,
      },
    });
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  _handleKeyDown(e) {
    const key = String.fromCharCode(e.keyCode);
    if (key === 'A' && e.ctrlKey) {
      e.preventDefault();
      this.setState({
        selectionComments: this.props.comments.entity.data.map( (item) => (item.id)),
      });
    }
    if (e.keyCode === 27 ) {
      this.setState({
        selectionComments: [],
      });
    }
    if (e.keyCode === 46) {
      this.deleteComments();
    }
  }

  replyToCommentState(item) {
    this.setState({
      id: this.props.params.id,
      isNewCommentPopupOpen: true,
      parentId: item.id,
      modalWindow: {
        title: `To ${ item.author }`,
      },
    });
  }

  async editCommentState(item) {
    const editDataComment = {
      isEditCommentPopupOpen: true,
      id: item.id,
      newCommentText: item.text,
      replay: 'Edit',
      modalWindow: {
        title: 'Edit',
      },
    };
    if (item.parentId) {
      editDataComment.parentId = item.parentId;
    }
    this.setState(editDataComment);
  }

  async editComment(item) {
    const editData = {
      id: this.state.id,
      text: this.state.newCommentText,
      author: this.props.user.name,
    };
    if (this.state.parentId) {
      editData.parentId = this.state.parentId;
    }

    await this.props.updateComment(editData);
    this.props.loadComments(this.props.params.id);
    this.setState({ newCommentText: '', isEditCommentPopupOpen: false});
  }

  showDeleteCommentsPopup() {
    this.setState({
      isDeleteCommentsPopupOpen: true,
    });
  }

  async handleSelectionChange(e) {
    const items = await e.target.winControl.selection.getItems();

    this.setState({
      selectionComments: items.map( (item) => (item.data.id)),
    });
  }

  async deleteComments() {
    if (this.state.selectionComments.length === 0) {
      return;
    }

    await this.props.deleteComments(this.state.selectionComments);
    this.setState({selectionComments: []});
    this.hideDeleteCommentsPopup();
    this.props.loadComments(this.props.params.id);
  }

  async handleItemSelected(item) {
    this.setState({
      selectionComments: [item.id],
    });
  }

  async createNewComment() {
    const newCommentData = {
      id: this.props.params.id,
      text: this.state.newCommentText,
      author: this.props.user.name,
    };

    if (this.state.parentId) {
      newCommentData.parentId = this.state.parentId;
    }

    await this.props.createComment(newCommentData);
    this.props.loadComments(this.props.params.id);
    this.setState({
      newCommentText: '',
      isNewCommentPopupOpen: false,
      parentId: '',
    });
  }

  hideNewCommentPopup() {
    this.setState({
      isNewCommentPopupOpen: false,
      newCommentText: '',
      parentId: '',
    });
  }

  hideEditCommentPopup() {
    this.setState({
      isEditCommentPopupOpen: false,
      newCommentText: '',
      parentId: '',
    });
  }

  hideDeleteCommentsPopup() {
    this.setState({
      isDeleteCommentsPopupOpen: false,
    });
  }

  renderAnswerToComments() {
    return (
      <Modal
        isOpen={this.state.isNewCommentPopupOpen}
        title={this.state.modalWindow.title}
        className={style.commentModal}>
      <form onSubmit={::this.createNewComment}>
        <label>
          <div className={style.labelName}>Message:</div>
          <textarea
            className={style.textArea}
            type="text"
            placeholder="i.e. English"
            autoFocus
            value={this.state.newCommentText}
            onChange={::this.onCommentTextInputChange}
            ></textarea>
        </label>
      </form>
      <WhiteFooter>
        <ActionButtonForModal
          className={commonStyles.saveButtonModal}
          onClick={::this.createNewComment}
          disabled={!this.state.newCommentText.length}
          inProgress={this.props.pendingActions.newComment}
          >
          Send
        </ActionButtonForModal>
        <ActionButtonForModal className={commonStyles.cancelButtonModal} onClick={::this.hideNewCommentPopup}>Cancel</ActionButtonForModal>
      </WhiteFooter>
    </Modal>);
  }

  renderEditComments() {
    return (<Modal
      isOpen={this.state.isEditCommentPopupOpen}
      title={this.state.modalWindow.title}
      className={style.commentModal}
      >
      <form onSubmit={::this.editComment}>
        <label>
          <div className={style.labelName}>Message:</div>
          <textarea
            className={style.textArea}
            type="text"
            placeholder="i.e. English"
            autoFocus
            value={this.state.newCommentText}
            onChange={::this.onCommentTextInputChange}
            ></textarea>
        </label>
      </form>
      <WhiteFooter>
        <ActionButtonForModal
          className={commonStyles.saveButtonModal}
          onClick={::this.editComment}
          disabled={!this.state.newCommentText.length}
          inProgress={this.props.pendingActions.newComment}>
          Send
        </ActionButtonForModal>
        <ActionButtonForModal className={commonStyles.cancelButtonModal} onClick={::this.hideEditCommentPopup}>Cancel</ActionButtonForModal>
      </WhiteFooter>
    </Modal>);
  }
  renderDeleteLibrariesPopup() {
    return (<Modal
      isOpen={this.state.isDeleteCommentsPopupOpen}
      title="Are you sure you want to delete selected items?"
      className={commonStyles.modal}
      >
      <WhiteFooter>
        <ActionButtonForModal
          className={commonStyles.saveButtonModal}
          onClick={::this.deleteComments}
          disabled={!this.state.selectionComments.length}
          inProgress={this.props.pendingActions.deleteComments}
          >
          Ok
        </ActionButtonForModal>
        <ActionButtonForModal className={commonStyles.cancelButtonModal} onClick={::this.hideDeleteCommentsPopup}>Cancel</ActionButtonForModal>
      </WhiteFooter>
    </Modal>);
  }

  render() {
    return (
      <div className={style.commentBlock}>
        { this.renderDeleteLibrariesPopup() }
        {this.renderAnswerToComments()}
        {this.renderEditComments()}
        <Header>
          {this.props.params.mediaName}
        </Header>

        <div className={style.commentsContent}>

          <div className={style.toolbar}>
            <span className={style.title}>Commentaries</span>
            <div className={style.toolbarBtn} onClick={::this.replyAll} onKeyDown={onEnterPressed(::this.replyAll)} tabIndex="0">REPLY ALL</div>
          </div>

          <div className={style.list}>{this.props.comments.entity.data.map( (item) => {
            const classes = cx({
              [style.itemText]: true,
              [style.level3]: item.parentId,
            });

            const classForItem = cx({
              [style.tplItem]: true,
              [style.selectable]: this.state.selectionComments.indexOf(item.id) !== -1,
            });

            return (
              <div className={classForItem} onClick={this.handleItemSelected.bind(this, item)} onKeyDown={onEnterPressed(this.handleItemSelected.bind(this, item))} tabIndex="0">
                <div className={classes}>
                  <h3 className={style.author}>{item.author}</h3>
                  <h6 className={style.text}>{item.text}</h6>
                </div>
                { (!item.parentId  && item.author !== this.props.user.name) ? <button className={style.replay} onClick={this.replyToCommentState.bind(this, item)} onKeyUp={onEnterPressed(this.replyToCommentState.bind(this, item))}>reply</button> : '' }

                { (item.author === this.props.user.name) ? <button className={style.replay} onClick={this.editCommentState.bind(this, item)} onKeyUp={onEnterPressed(this.editCommentState.bind(this, item))}>edit</button> : '' }
              </div>
            );
          })}</div>
        </div>
        <Footer>
          <ActionButton
            disabled={this.state.selectionComments.length === 0}
            onClick={::this.showDeleteCommentsPopup}
            icon="mdl2-delete"
            tooltipText="Delete comments">
          </ActionButton>
        </Footer>
      </div>
    );
  }
}
