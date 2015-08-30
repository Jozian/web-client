import React, { Component } from 'react';
import styles from './index.css';

export default class LoadingSpinner extends Component {
  static propTypes = {
    loading: React.PropTypes.bool,
    children: React.PropTypes.node,
  }

  render() {
    const loading = this.props.loading;
    return (<div>
      {loading
        ? <div className={styles.container}>
            <div className={styles.dots}></div>
          </div>
        : this.props.children
      }
    </div>);
  }
}
