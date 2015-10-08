import React, { Component } from 'react';
import { ListView, reactRenderer as winjsReactRenderer } from 'react-winjs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from 'components/Button';
import * as actions from '../../actions/media-comments';
import { listLayout } from 'common';
import Modal from 'components/Modal';
import loading from 'decorators/loading';
import ActionButton from 'components/ActionButton';
import Footer from 'components/Footer';
import cx from 'classnames';

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

  replyAllEnter(e) {
    if (e.keyCode === 13) {
      this.replyAll();
    }
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate() {
    if (this.state.selectItem && this.state.selectOnLoad) {
      this.refs.folder.winControl.selection.set(this.state.selectItem);
      setImmediate(() => this.refs.folder.winControl.ensureVisible(this.state.selectItem));
      this.setState({selectOnLoad: false});
    }
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
      this.deleteComments();
    }
  }

  replyToCommentState(item) {
    this.setState({
      id: this.props.params.id,
      isNewCommentPopupOpen: true,
      parentId: item.data.id,
      modalWindow: {
        title: `To ${ item.data.author }`,
      },
    });
  }

  replyToCommentEnterState(item, event) {
    if (event.keyCode === 13) {
      this.replyToCommentState(item);
    }
  }

  async editCommentState(item) {
    const editDataComment = {
      isEditCommentPopupOpen: true,
      id: item.data.id,
      newCommentText: item.data.text,
      replay: 'Edit',
      modalWindow: {
        title: 'Edit',
      },
    };
    if (item.data.parentId) {
      editDataComment.parentId = item.data.parentId;
    }
    this.setState(editDataComment);
  }

  editCommentEnterState (item, event) {
    if (event.keyCode === 13) {
      this.editCommentState(item);
    }
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

  async handleItemSelected(event) {
    const item = await event.detail.itemPromise;
    this.setState({
      selectItem: item,
      selectOnLoad: true,
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
    });
  }

  hideNewCommentPopup() {
    this.setState({
      isNewCommentPopupOpen: false,
    });
  }

  hideEditCommentPopup() {
    this.setState({
      isEditCommentPopupOpen: false,
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
            role="Text for new comment"
            />
        </label>
      </form>
      <Footer>
        <ActionButton
          icon="fa fa-check"
          onClick={::this.createNewComment}
          disabled={!this.state.newCommentText.length}
          inProgress={this.props.pendingActions.newComment}
          role="OK button"
          >
          Ok
        </ActionButton>
        <Button icon="fa fa-ban" onClick={::this.hideNewCommentPopup} role="Cancel button">Cancel</Button>
      </Footer>
    </Modal>);
  }

  renderEditComments() {
    return (<Modal
      isOpen={this.state.isEditCommentPopupOpen}
      title={this.state.modalWindow.title}
      className={style.commentModal}
      >
      <form onSubmit={::this.editComment}>
        <label >
          <div className={style.labelName}>Message:</div>
          <textarea
            className={style.textArea}
            type="text"
            placeholder="i.e. English"
            autoFocus
            value={this.state.newCommentText}
            onChange={::this.onCommentTextInputChange}
            role="Text for edit comment"
            />
        </label>
      </form>
      <Footer>
        <ActionButton
          icon="fa fa-check"
          onClick={::this.editComment}
          disabled={!this.state.newCommentText.length}
          inProgress={this.props.pendingActions.newComment}
          role="OK button">
          Ok
        </ActionButton>
        <Button icon="fa fa-ban" onClick={::this.hideEditCommentPopup} role="Cancel button">Cancel</Button>
      </Footer>
    </Modal>);
  }
  renderDeleteLibrariesPopup() {
    return (<Modal
      isOpen={this.state.isDeleteCommentsPopupOpen}
      title="Are you sure you want to delete selected items?"
      className={commonStyles.modal}
      >
      <Footer>
        <ActionButton
          icon="fa fa-check"
          onClick={::this.deleteComments}
          disabled={!this.state.selectionComments.length}
          inProgress={this.props.pendingActions.deleteComments}
          >
          Ok
        </ActionButton>
        <Button icon="fa fa-ban" onClick={::this.hideDeleteCommentsPopup}>Cancel</Button>
      </Footer>
    </Modal>);
  }

  listViewItemRenderer = winjsReactRenderer((item) => {
    const classes = cx({
      [style.itemText]: true,
      [style.level3]: item.data.parentId,
    });

    return (
      <div className={style.tplItem}>
        <div className={classes}>
          <h3 className={style.author}>{item.data.author}</h3>
          <h6 className={style.text}>{item.data.text}</h6>
        </div>
        { (!item.data.parentId  && item.data.author !== this.props.user.name) ? <button className={style.replay} onClick={this.replyToCommentState.bind(this, item)} onKeyUp={this.replyToCommentEnterState.bind(this, item)} >reply</button> : '' }

        { (item.data.author === this.props.user.name) ? <button className={style.replay} onClick={this.editCommentState.bind(this, item)} onKeyUp={this.editCommentEnterState.bind(this, item)}>edit</button> : '' }
      </div>
    );
  });
  render() {
    return (
      <div className={style.commentBlock}>
        { this.renderDeleteLibrariesPopup() }
        {this.renderAnswerToComments()}
        {this.renderEditComments()}
        <h1>
          {this.props.params.mediaName}
        </h1>

        <div className={style.commentsContent}>

          <div className={style.toolbar}>
            <span className={style.title} role={ `Commentaries for media ${this.props.params.mediaName} `}>Commentaries</span>
            <button className={style.toolbarBtn} onClick={::this.replyAll} onKeyUp={::this.replyAllEnter}  role="Replay all" >REPLY ALL</button>
          </div>
            <ListView
                ref="folder"
                className={style.list}
                itemDataSource={this.props.comments.entity.data.dataSource}
                itemTemplate={this.listViewItemRenderer}
                onItemInvoked={::this.handleItemSelected}
                onSelectionChanged={::this.handleSelectionChange}
                layout={listLayout} />


          <div className={style.bottombar}>
            <div className={style.footerWrapper}>

                <Button
                  disabled={this.state.selectionComments.length === 0}
                  icon="fa fa-trash-o"
                  onClick={::this.showDeleteCommentsPopup}
                  className={style.footerButton}
                  role="Delete button">
                  Delete
                </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
