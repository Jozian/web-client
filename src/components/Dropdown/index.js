import React, { Component } from 'react';
import style from './index.css';
import fontAwesome from 'font-awesome-webpack'; // eslint-disable-line no-unused-vars

export default class Dropdown extends Component {
  static propTypes = {
    title: React.PropTypes.string,
  };

  render() {

    return (<div className={style.editUser}>
        <label className={style.userLabel}>{this.props.title}</label>
        <div className={style.selectContainer}>
          <select className={style.optionsSelect} name="type">
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
      </div>
    );
  }
}