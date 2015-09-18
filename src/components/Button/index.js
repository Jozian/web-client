import React, { Component, PropTypes } from 'react';
import styles from './index.css';
import cx from 'classnames';
import 'font-awesome-webpack';

export default class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    icon: PropTypes.string,
    text: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
  };

  render() {
    const disabled = this.props.disabled ? 'disabled' : '';
    const classes = cx({
      [styles.button]: true,
      [this.props.className]: this.props.className !== null,
    });
    return (
      <button type="button"
              className={classes}
              onClick={this.props.onClick}
              disabled={disabled}>
              {this.props.icon ? <i className={this.props.icon}></i> : null }
              {this.props.children}
              {this.props.text}
      </button>
    );
  }
}
