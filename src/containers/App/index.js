import React, { Component } from 'react';
import { RouteHandler } from 'react-router';
import { connect } from 'react-redux';

import NavBar from '../../components/NavBar';
import styles from './index.css';

@connect(
  (state) => ({user: state.currentUser})
)
export default class App extends Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
  }

  render() {
    return (<div>
      <NavBar username={this.props.user.name} />
      <section className={styles.contenthost}>
        <RouteHandler />
      </section>
    </div>);
  }
}
