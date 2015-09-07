import React, { Component } from 'react';
import styles from './index.css';

import 'font-awesome-webpack';

export default class Button extends Component {
  static propTypes = {
    children: React.PropTypes.node,
    icon: React.PropTypes.string,
    text: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    style: React.PropTypes.string,
  };

  render() {
    const disabled = this.props.disabled ? 'disabled' : '';

    return (
      <button type="button"
              className={this.props.style === null ? styles.button : this.props.style + ' ' + styles.button}
              onClick={this.props.onClick}
              disabled={disabled}>
              {this.props.icon ? <i className={this.props.icon}></i> : null }
              {this.props.children}
              {this.props.text}
      </button>
    );
  }
}
