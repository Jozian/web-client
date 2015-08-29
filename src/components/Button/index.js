import React, { Component } from 'react';
import style from './index.css';
import fontAwesome from 'font-awesome-webpack'; // eslint-disable-line no-unused-vars

export default class Button extends Component {
  static propTypes = {
    icon: React.PropTypes.string,
    text: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
  };

  render() {
    const disabled = this.props.disabled ? 'disabled' : '';

    return (
      <button type="button" className={style.iconButton} onClick={this.props.onClick} disabled={disabled}>
        <i className={this.props.icon}></i>
        {this.props.text}
      </button>
    );
  }
}
