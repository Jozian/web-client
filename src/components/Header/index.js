import React, { Component } from 'react';

import SearchBar from 'containers/SearchBar';

import styles from './index.css';

export default class Header extends Component {
    static propTypes = {
      children: React.PropTypes.node,
    }
    render() {
      return (
        <h1 className={styles.pageHeader}>
          <SearchBar />
          { this.props.children }
        </h1>
      );
    }
}
