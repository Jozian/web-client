import React, { Component } from 'react';
import style from './index.css';
import fontAwesome from 'font-awesome-webpack'; // eslint-disable-line no-unused-vars

export default class Input extends Component {
  static propTypes = {
    title: React.PropTypes.string,
    value: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    type: React.PropTypes.string,
  };

  render() {
    return (<div className={style.editRow}>
        <label className={style.editLabel}>{this.props.title}</label>
        <input
          className={style.editInput}
          type="text" name="name"
          placeholder={this.props.placeholder}
          value={this.props.value}
          type={this.props.type}>
        </input>
      </div>
    );
  }
}
