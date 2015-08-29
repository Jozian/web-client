import React, { Component } from 'react';

export default class LoadingSpinner extends Component {
  static propTypes = {
    loading: React.PropTypes.bool,
    children: React.PropTypes.node,
  }

  render() {
    if (this.props.loading) {
      return <div key="container">Loading</div>;
    }

    return <div>{this.props.children}</div>;
  }
}
