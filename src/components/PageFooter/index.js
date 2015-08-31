import React, { Component } from 'react';
import styles from './index.css';

export default class PageFooter extends Component {
  static propTypes = {
    children: React.PropTypes.node,
  }
  render() {
    return (
      <footer className={styles.pageFooter}>
        <div className={styles.wrapper}>
          { this.props.children }
        </div>
      </footer>
    );
  }
}
