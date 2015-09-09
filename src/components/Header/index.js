import React, { Component } from 'react';
import styles from './index.css';

export default class Header extends Component {
    static propTypes = {
      children: React.PropTypes.node,
    }
    render() {
      return (
        <h1 className={styles.pageHeader}>
          { this.props.children }
        </h1>
      );
    }
}
