import React, { Component } from 'react';
import { RouteHandler } from 'react-router';
import NavBar from '../../components/NavBar';

import styles from './index.css';

export default class App extends Component {
  render() {
    return (<div>
      <NavBar />
      <section className={styles.contenthost}>
        <RouteHandler />
      </section>
    </div>);
  }
}
