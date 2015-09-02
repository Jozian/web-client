import React, { Component } from 'react';
import style from './index.css';
import fontAwesome from 'font-awesome-webpack'; // eslint-disable-line no-unused-vars

export default class Dropdown extends Component {
  static propTypes = {
    title: React.PropTypes.string,
    value: React.PropTypes.node.isRequired,
  };

  render() {

    return (<div className={style.editUser}>
        <label className={style.userLabel}>{this.props.title}</label>
          <select className={style.optionsSelect} name="type">{this.props.children}</select>
      </div>
    );
  }
}