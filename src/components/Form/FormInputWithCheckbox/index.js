import React, { Component } from 'react';
import styles from './index.css';
import Checkbox from '../../Checkbox';
import cx from 'classnames';

export default class FormInputWithCheckbox extends Component {
  static propTypes = {
    label: React.PropTypes.string,
    name: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    type: React.PropTypes.string,
    onCheckboxChange: React.PropTypes.func,
    checked: React.PropTypes.bool,
    errorMessage: React.PropTypes.string,
    valueLink: React.PropTypes.shape({
      value: React.PropTypes.any.isRequired,
      requestChange: React.PropTypes.func.isRequired,
    }),
    onBlur: React.PropTypes.func,
  };
  render() {
    const classes = cx({
      [styles.editInput]: true,
      [styles.checkboxInput]: true,
      [styles.disabled]: !this.props.checked,
      [styles.error]: this.props.errorMessage.length !== 0,
    });
    const ErrorMessage = (() => {
      if (this.props.errorMessage.length !== 0) {
        return <span className={styles.errorMessage}>{this.props.errorMessage}</span>;
      }
    }());
    return (
      <div className={styles.editRow}>
        <div className={styles.editCheckbox}>
          <Checkbox title={this.props.label}
                    onChange={this.props.onCheckboxChange}
                    checked={this.props.checked}/>
        </div>
        <input valueLink={this.props.valueLink}
               className={classes}
               type={this.props.type}
               name={this.props.name}
               onBlur={this.props.onBlur}
               placeholder={this.props.placeholder}/>
        {ErrorMessage}
      </div>
    );
  }
}

