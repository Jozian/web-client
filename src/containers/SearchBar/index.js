import React, { Component } from 'react';
import { ListView, reactRenderer as winjsReactRenderer } from 'react-winjs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { debounce } from 'lodash';
import cx from 'classnames';

import PreviewImage from 'components/PreviewImage';
import * as actionsSearch from 'actions/searchResult';
import { onEnterPressed } from 'common';

import styles from './style.css';

@connect(
  (state) => ({ searchResult: state.searchResult }),
  (dispatch) => bindActionCreators(actionsSearch, dispatch)
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
    document.addEventListener('keydown', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('keydown', this.handleClick);
  }
  async userSelected(item) {
    this.context.router.transitionTo('editUser', {
      id: item.id.toString(),
    });

    this.hideList();
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

  async mediaSelected(item) {
    if (item.FolderId) {
      item.LibraryId = item.FolderId;
    }
    const routeParams = {
      itemId: item.id.toString(),
      itemType: 'media',
      folderId: item.LibraryId.toString(),
    };

    await this.context.router.transitionTo('mediaSelection', routeParams);
    this.hideList();
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

  render() {
    return (
      <div className={styles.searchBar} ref="searchList">
        <label htmlFor="searchElem" className={styles.hidden}>Search</label>
        <input id="searchElem" type="text" className={styles.input} onInput={(e) => {::this.inputHandler(e.target.value); }} role="search"/>

        {this.state.showSearchList ?
          <div className={cx(styles.list, 'searchList')}>
            <h3 className={styles.headerList} role="listbox">Users</h3>
            {this.props.searchResult.entities.users.length ?
              <div>
                {this.props.searchResult.entities.users.map( (item) => {
                  return (
                    <div className={styles.userItem} onClick={this.userSelected.bind(this, item)} onKeyDown={onEnterPressed(this.userSelected.bind(this, item))} tabIndex="0">{item.name}</div>
                  );
                })}
              </div> : 'NO RESULT'}

            <h3 className={styles.headerList} role="listbox">Media</h3>
            {this.props.searchResult.entities.media.length ?
              <div>
                {this.props.searchResult.entities.media.map( (item) => {
                  return (<div className={styles.listItem}>
                    <div onClick={this.mediaSelected.bind(this, item)} tabIndex="0" onKeyDown={onEnterPressed(this.mediaSelected.bind(this, item))}>
                      <PreviewImage className={styles.image} src={'http://medserver.apps.wookieelabs.com/preview/' + item.id + '.png'} />
                      {item.name}
                    </div>
                  </div>);
                })}
              </div> : 'NO RESULT'}
          </div> : ''}
      </div>
    );
  }
}
