import React, { Component } from 'react';
import Table from '../../components/Table/index.js';
import ReactWinJS from 'react-winjs';
import { connect } from 'react-redux';
import * as actions from '../../actions/media-comments.js';
import { bindActionCreators } from 'redux';

import style from './style.css';

@connect(
    (state) => ({comments: state.comments}),
    (dispatch) => bindActionCreators(actions, dispatch)
)
export default class CommentDetails extends Component {

  static propTypes = {
    comments: React.PropTypes.array.required,
  }
  constructor(props) {
    super(props);

    props.loadComments(this.props.params.id);
    this.state = { loading: true };
  }

  componentWillMount() {
    const comments = this.props.comments;
    if(!comments.loading && !comments.error) {
      this.setState({
        comments: new WinJS.Binding.List(comments),
      });
    }
  }

  componentWillUpdate(props) {
    if(this.props === props) {
      return;
    }

    const comments = props.comments;
    this.setState({ loading: comments.loading });

    if(!comments.loading && !comments.error) {
      this.setState({
        comments: new WinJS.Binding.List(comments),
      });
    }
  }

  render() {
    return (
      <div>
        <div data-win-control="WinJS.Binding.Template" style={{display: 'none'}}>
          <div className={style.tplItem}>
            <div className={style.checkbox}>
              <label>
                <input type="checkbox" name="#" data-win-bind="name: id"/>
                <div className={style.bodyBox}></div>
              </label>
            </div>
            <div className={style.itemText}
                 data-win-bind="style.marginLeft: lvl NED.mediaComments.getMargin">
              <h3 data-win-bind="textContent: author"> </h3>
              <h6 data-win-bind="textContent: text"></h6>
            </div>
            <button data-win-bind="style.display: lvl NED.mediaComments.getDisplay" className={style.replay}>reply</button>
            <button data-win-bind="style.display: author NED.mediaComments.getEditDisplay">edit</button>
          </div>
        </div>

        <h1>
          <button data-win-control="WinJS.UI.BackButton"></button>
        </h1>

        <div className={style.commentsContent}>

          <div className={style.toolbar}>
            <span className={style.title}>Commentaries</span>
            <button className={style.toolbarBtn}>Reply All</button>
          </div>
          <div className={style.list}
             data-win-control="WinJS.UI.ListView"
             data-win-options="{
                itemDataSource: MediaComments.ListView.data.dataSource,
                selectionMode: 'none',
                tapBehavior: 'none',
                swipeBehavior: 'none',
                itemTemplate: select('.b_media-comments-list-tpl'),
                layout: { type: WinJS.UI.ListLayout }
            }">

            <ReactWinJS.ListView
                className={style.list}
                itemDataSource={this.props.comments.dataSource}
                itemTemplate={this.listViewItemRenderer}
                layout={ {type: WinJS.UI.ListLayout} } />
          </div>
          <div className={style.bottombar}>
            <div className={style.footerWrapper}>
              <button className={style.footerButton} disabled="disabled"><i className="fa fa-trash-o"></i> Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
