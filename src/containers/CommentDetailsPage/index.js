import React, { Component } from 'react';
import { ListView, reactRenderer as winjsReactRenderer } from 'react-winjs';
import { connect } from 'react-redux';
import Button from 'components/Button';
import * as actions from '../../actions/media-comments.js';
import winjsBind from '../../decorators/winjsBind';
import { bindActionCreators } from 'redux';
import { listLayout } from 'common';
import Modal from 'components/Modal';
import loading from 'decorators/loading';
import ActionButton from 'components/ActionButton';
import Footer from 'components/Footer';
import cx from 'classnames';

import style from './style.css';

@connect(
    (state) => ({comments: state.comments, user: state.currentUser, pendingActions: state.pendingActions}),
    (dispatch) => bindActionCreators(actions, dispatch)
)
@winjsBind(
    (props) => ({
      commentList: props.comments.entities.allComments,
    })
)
@loading(
  (state) => state.comments.loading,
  { isLoadingByDefault: true }
)
export default class CommentDetails extends Component {

  static propTypes = {
    commentList: React.PropTypes.shape({
      dataSource: React.PropTypes.object.isRequired,
    }),
    params: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
    deleteComments: React.PropTypes.func.isRequired,
    pendingActions: React.PropTypes.object.isRequired,
    createComment: React.PropTypes.func.isRequired,
    loadComments: React.PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);

    props.loadComments(this.props.params.id);
    this.state = {
      loading: true,
      selectionComments: [],
      newCommentText: '',
    };
  }

  componentWillReceiveProps(props) {
    if (props === this.props) {
      return;
    }
    this.setState({ loading: props.comments.loading});
  }

  openNewCommentPopup(data) {
    this.setState(data);
  }

  createNewComment(event) {
    if (this.props.pendingActions.newComment) {
      return;
    }

    if (!this.state.newCommentText.length) {
      return;
    }

    const data = {
      id: this.props.params.id,
      text: this.state.newCommentText,
      author: this.props.user.name,
    };

    if (this.state.parentId) {
      data.parentId = this.state.parentId;
    }

    if (this.state.replay) {
      data.replay = 'Edit';
    }

    this.props.createComment(data).then(() => this.props.loadComments(this.props.params.id)).then(::this.hideNewCommentPopup);
    event.preventDefault();
  }

  hideNewCommentPopup() {
    this.setState({isNewCommentPopupOpen: false});
  }

  onCommentTextInputChange(event) {
    this.setState({
      newCommentText: event.target.value,
    });
  }

  replyAll() {
    const someObj = {
      newLibraryName: '',
      isNewCommentPopupOpen: true,
      title: `To ${ this.props.params.mediaName }`,
    };
    this.openNewCommentPopup(someObj);
  }

  async replyToComment(item) {
    const someObj = {
      id: this.props.params.id,
      newLibraryName: '',
      isNewCommentPopupOpen: true,
      parentId: item.data.id,
      title: `To ${ item.data.author }`,
    };
    this.openNewCommentPopup(someObj);
  }

  async editComment(item) {
    const someObj = {
      newLibraryName: '',
      isNewCommentPopupOpen: true,
      id: item.data.id,
      replay: 'Edit',
      title: 'Edit',
    };
    this.openNewCommentPopup(someObj);
  }

  renderAnswerToComments() {
    return (<Modal
      isOpen={this.state.isNewCommentPopupOpen}
      title={this.state.title}
      className={style.commentModal}
      >
      <form onSubmit={::this.createNewComment}>
        <label className={style.labelName}>
          Message:
          </label>
          <textarea
            className={style.textArea}
            type="text"
            placeholder="i.e. English"
            autoFocus
            value={this.state.newCommentText}
            onChange={::this.onCommentTextInputChange}
            ></textarea>
      </form>
      <Footer>
        <ActionButton
          icon="fa fa-check"
          onClick={::this.createNewComment}
          disabled={!this.state.newCommentText.length}
          inProgress={this.props.pendingActions.newComment}
          >
          Ok
        </ActionButton>
        <Button icon="fa fa-ban" onClick={::this.hideNewCommentPopup}>Cancel</Button>
      </Footer>
    </Modal>);
  }

  async handleSelectionChange(e) {
    const items = await e.target.winControl.selection.getItems();

    this.setState({
      selectionComments: items.map( (item) => (item.data.id)),
    });
  }

  deleteComments() {
    if (this.state.selectionComments.length === 0) {
      return;
    }

    this.props.deleteComments(this.state.selectionComments)
      .then(() => this.setState({selectedComments: []}))
      .then(this.props.loadComments(this.props.params.id))
    ;
  }

  listViewItemRenderer = winjsReactRenderer((item) => {
    const classes = cx({
      [style.itemText]: true,
      [style.level3]: item.data.parentId,
    });

    const classesForReply = cx({
      [style.replay]: true,
      [style.displayNone]: item.data.parentId  && item.data.author !== this.props.user.name,
    });

    const classesForEdit = cx({
      [style.replay]: true,
      [style.displayNone]: item.data.author !== this.props.user.name,
    });
    return (
      <div className={style.tplItem}>
        <div className={classes}>
          <h3 className={style.author}>{item.data.author}</h3>
          <h6 className={style.text}>{item.data.text}</h6>
        </div>
        <button className={classesForReply} onClick={this.replyToComment.bind(this, item)}>reply</button>
        <button className={classesForEdit} onClick={this.editComment.bind(this, item)}>edit</button>
      </div>
    );
  });
  render() {
    return (
      <div>
        {this.renderAnswerToComments()}
        <h1>
          {this.props.params.mediaName}
        </h1>

        <div className={style.commentsContent}>

          <div className={style.toolbar}>
            <span className={style.title}>Commentaries</span>
            <button className={style.toolbarBtn} onClick={::this.replyAll} >REPLY ALL</button>
          </div>
            <ListView
                ref="folder"
                className={style.list}
                itemDataSource={this.props.commentList.dataSource}
                itemTemplate={this.listViewItemRenderer}
                onSelectionChanged={::this.handleSelectionChange}
                layout={listLayout} />

          <div className={style.bottombar}>
            <div className={style.footerWrapper}>
              <Button
                disabled={this.state.selectionComments.length === 0}
                icon="fa fa-trash-o"
                onClick={::this.deleteComments}
                >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
