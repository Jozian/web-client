import React, { Component } from 'react';
import styles from './index.css';
import logo from 'file!./assets/logo.png';

export default class NavBar extends Component {
  render() {
    return (<nav className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logo} />
      </div>
    </nav>);
  }
}
