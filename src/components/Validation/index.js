import {createValidator, required, phone, email, unique, match} from './validation';

export const widgetValidation = createValidator({
  phone: [phone],
  email: [email, required],
  name: [required, unique],
  login: [required, unique],
  /*password: [required],
  confirm: [match],*/
});

/*import React, { Component } from 'react';
import styles from './index.css';
import { Classnames } from 'classnames';
import * as actions from '../../actions/users.js';


export default class Validation extends Component {
  static propTypes = {
    text: React.PropTypes.string,
    condition: React.PropTypes.bool,
    style: React.PropTypes.string,
    /!*children: React.PropTypes.node.isRequired,*!/
  };

  render() {
    /!*this.props.isUnique(user);*!/
    const cx = React.addons.classSet;
    const classes = cx({
      [styles.message]: true,
      [styles.messageEnable]: !this.props.condition,
    });
    return (
         <p className={classes}>{this.props.text}</p>
    );
  }
}*/

