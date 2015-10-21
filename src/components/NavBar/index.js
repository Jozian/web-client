import React, { Component } from 'react';
import { Link } from 'react-router';
import 'font-awesome-webpack';
import cx from 'classnames';

import IconButton from '../IconButton';
import styles from './index.css';
import logo from 'file!./assets/logo.png';

export default class NavBar extends Component {
  static propTypes = {
    username: React.PropTypes.string.isRequired,
  }

  getAvailableLinks() {
    // TODO: implement operator check logic
    return NavBar.links;
  }

  static links = [
    {to: 'libraries', title: 'Libraries'},
    {to: 'users', title: 'Users'},
    {to: 'comments', title: 'Comments'},
    {to: 'motd', title: 'Message of the Day'},
    {to: 'statistics', title: 'Statistics'},
  ]

  render() {
    return (<nav className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logo} />
        <p className={styles.logoText}>Microsoft<br /> Education Delivery</p>
      </div>
      {
        this.getAvailableLinks().map((item) =>
          <Link key={item.to} to={item.to}>{item.title}</Link>
        )
      }
      <div className={styles.footer}>
        <span className={styles.username}>{this.props.username}</span>
        <IconButton icon="fa fa-power-off" className={styles.logout} />
      </div>
    </nav>);
  }
}
