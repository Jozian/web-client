import React, { Component } from 'react';
import style from './index.css';
import fontAwesome from 'font-awesome-webpack'; // eslint-disable-line no-unused-vars

export default class Button extends Component{
  render() {
    let disabled = this.props.disabled ? 'disabled' : '';

    return (
      <button type="button" className={style.iconButton} onClick={this.props.onClick} disabled={disabled}>
        <i className={this.props.icon}></i>
        {this.props.text}
      </button>
    )
  }
}