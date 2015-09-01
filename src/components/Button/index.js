import React, { Component } from 'react';
import style from './index.css';
import 'font-awesome-webpack';

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
      <button type="button" className={style.button} onClick={this.props.onClick} disabled={disabled}>
        {this.props.icon ? <i className={this.props.icon}></i> : null }
        {this.props.text}
      </button>
    );
  }
}
