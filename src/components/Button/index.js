import React, { Component, PropTypes } from 'react';
import styles from './index.css';
import cx from 'classnames';
import 'font-awesome-webpack';

export default class Button extends Component {
  static propTypes = {
    children: PropTypes.node,
    text: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
    tooltipText: PropTypes.string,
  };

  render() {
    debugger;
    const disabled = this.props.disabled ? 'disabled' : '';
    const classes = cx({
      [styles.button]: true,
      [this.props.className]: this.props.className !== null,
    });
    return (
      <div className={styles.bottonBody}>
        <button type="button"
              className={classes}
              onClick={this.props.onClick}
              disabled={disabled}
              role="button">
              {this.props.children}
              {this.props.text}
        <span className={styles.hideText}>{this.props.tooltipText}</span></button>
        {this.props.tooltipText ? <div className={styles.tooltip}>{this.props.tooltipText}</div> : ''}
      </div>
    );
  }
}
