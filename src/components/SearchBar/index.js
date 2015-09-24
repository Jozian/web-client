import React, { Component } from 'react';
import { ListView, reactRenderer as winjsReactRenderer } from 'react-winjs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { debounce } from 'lodash';
import cx from 'classnames';

import { listLayout } from 'common';
import * as actions from 'actions/searchResult';

import styles from './style.css';

@connect(
  (state) => ({ searchResult: state.searchResult }),
  (dispatch) => bindActionCreators(actions, dispatch)
)
export default class SearchBar extends Component {

  static propTypes = {
    searchResult: React.PropTypes.shape({
      entity: React.PropTypes.object.isRequired,
    }),
  };

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showSearchList: false,
      searchText: '',
    };
    this.handleClick = ::this._handleClick;
  }
  componentWillMount() {
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
  }
  userSelected(item) {
    this.context.router.transitionTo('editUser', {
      id: item.data.id.toString(),
    });
  }
  _handleClick(e) {
    const searchTableElem = this.refs.searchList.getDOMNode();
    let currentElem = e.target;

    while (currentElem && this.state.showSearchList) {
      if (searchTableElem === currentElem) {
        break;
      } else {
        currentElem = currentElem.parentElement;
      }
    }
    if (!currentElem) {
      this.hideList();
    }
  }

  mediaSelected(item) {
    const routeParams = {
      itemId: item.data.id.toString(),
      itemType: 'media',
    };
    if (!item.data.FolderId) {
      routeParams.folderId = 'library' + item.data.LibraryId;
    }
    this.context.router.transitionTo('folderSelection', routeParams);
  }

  highlightCurrentSearch(currentString) {
    const startIndex = currentString.toLowerCase().indexOf(this.state.searchText.toLowerCase());
    if (startIndex === -1) {
      return <span>{currentString}</span>;
    }

    const prefix = currentString.substr(0, startIndex);
    const postfix = currentString.substr(startIndex + this.state.searchText.length);

    return <span>{prefix}<span className={styles.red}>{this.state.searchText}</span>{postfix}</span>;
  }

  hideList() {
    this.setState({
      showSearchList: false,
      searchText: '',
    });
  }

  async debounceFunction(value) {
    await this.props.loadSearchResult(value);
    this.setState({
      showSearchList: true,
      searchText: value,
    });
  }
  inputHandler = debounce((value) => {
    if (!value) {
      this.hideList();
      return;
    }
    this.debounceFunction(value);
  }, 500);

  listViewSearchUserItemRenderer = winjsReactRenderer((item) => {
    return (
      <div onClick={this.userSelected.bind(item, this)}>
        <span className={cx('fa', 'fa-user', styles.icon)}></span>
        {this.highlightCurrentSearch(item.data.name)}
      </div>
    );
  });

  listViewSearchMediaItemRenderer = winjsReactRenderer((item) => {
    const classes = cx({
      'fa': true,
      [styles.icon]: true,
      'fa-file-video-o': item.data.type === 'video',
      'fa-file-picture-o': item.data.type === 'image',
      'fa-file-text-o': item.data.type === 'text',
    });
    return (
      <div onClick={this.mediaSelected.bind(this, item)}>
        <span className={classes}></span>
        {this.highlightCurrentSearch(item.data.name)}
      </div>
    );
  });
  render() {
    return (
      <div className={styles.searchBar} ref="searchList">
        <input type="text" className={styles.input} onInput={(e) => {::this.inputHandler(e.target.value); }} />

        {this.state.showSearchList ?
            <div className={cx(styles.list, 'searchList')}>
              <h3 className={styles.headerList}>Users</h3>
              {this.props.searchResult.entity.users.data.length > 0 ?
              <ListView
                itemDataSource={this.props.searchResult.entity.users.data.dataSource}
                itemTemplate={this.listViewSearchUserItemRenderer}
                layout={listLayout}
                />
                : <span className={styles.noResults}>No results found</span> }

              <h3 className={styles.headerList}>Media files</h3>
              {this.props.searchResult.entity.media.data.length > 0 ?
              <ListView
                itemDataSource={this.props.searchResult.entity.media.data.dataSource}
                itemTemplate={this.listViewSearchMediaItemRenderer}
                layout={listLayout} />
                : <span className={styles.noResults}>No results found</span> }
            </div> : ''}


      </div>
    );
  }
}
