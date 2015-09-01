import React, { Component } from 'react';
import CSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import styles from './index.css';

export default class LoadingSpinner extends Component {
  static propTypes = {
    loading: React.PropTypes.bool,
    children: React.PropTypes.node,
  }

  render() {
    const loading = this.props.loading;
    return (<CSSTransitionGroup component="div" transitionName="loader">
      {loading
        ? <div key="loader" className={styles.container}>
            <div className={styles.dots}></div>
          </div>
        : <div key="content">{this.props.children}</div>
      }
    </CSSTransitionGroup>);
  }
}
