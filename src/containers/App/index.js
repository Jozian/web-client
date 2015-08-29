import React, { Component } from 'react';
import { RouteHandler } from 'react-router';
import { connect } from 'react-redux';

import NavBar from '../../components/NavBar';
import styles from './index.css';

@connect(
  (state) => ({name: state.currentUser.name})
)
export default class App extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
  }

  render() {
    return (<div>
      <NavBar username={this.props.name} />
      <section className={styles.contenthost}>
        <RouteHandler />
      </section>
    </div>);
  }
}
