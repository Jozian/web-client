import React, { Component } from 'react';
import { Link } from 'react-router';
import fontAwesome from 'font-awesome-webpack'; // eslint-disable-line no-unused-vars

import styles from './index.css';
import logo from 'file!./assets/logo.png';
import IconButton from '../IconButton';

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
      <div className={styles.footer}>
        <i className="fa fa-user"></i>{this.props.username}
        <IconButton icon="fa fa-power-off" handleClick={() => alert('Logout!')} className="btn-logout" />
      </div>
    </nav>);
  }
}
