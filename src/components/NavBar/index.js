import React, { Component } from 'react';
import { Link } from 'react-router';

import styles from './index.css';
import logo from 'file!./assets/logo.png';

export default class NavBar extends Component {
  getAvailableLinks() {
    // TODO: implement operator check logic
    return NavBar.links;
  }

  static links = [
    {to: 'users', title: 'Users'},
    {to: 'libraries', title: 'Libraries'},
  ]

  render() {
    return (<nav className={styles.sidebar}>
      <i className="fa fa-facebook"></i>
      <div className={styles.logo}>
        <img src={logo} />
      </div>
      {
        this.getAvailableLinks().map((item) => <Link to={item.to}>{item.title}</Link>)
      }
    </nav>);
  }
}
