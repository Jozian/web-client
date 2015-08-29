import React, { Component } from 'react';
import { Link } from 'react-router';
import 'font-awesome-webpack';

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
    {to: 'users', title: 'Users'},
    {to: 'libraries', title: 'Libraries'},
    {to: 'comments', title: 'Comments'},
    {to: 'motd', title: 'Message of the Day'},
    {to: 'statistics', title: 'Statistics'},
  ]

  render() {
    return (<nav className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logo} />
      </div>
      {
        this.getAvailableLinks().map((item) => <Link to={item.to}>{item.title}</Link>)
      }
      <div className={styles.footer}>
        <i className="fa fa-user"></i>{this.props.username}
        <IconButton icon="fa fa-power-off" className="btn-logout" />
      </div>
    </nav>);
  }
}
