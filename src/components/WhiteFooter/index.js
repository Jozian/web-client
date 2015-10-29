import React, { Component } from 'react';
import styles from '../Footer/index.css';

export default class WhiteFooter extends Component {
  static propTypes = {
    children: React.PropTypes.node,
  }
  render() {
    return (
      <footer className={styles.whitePageFooter}>
        <div className={styles.wrapperWhite}>
          { this.props.children }
        </div>
      </footer>
    );
  }
}

