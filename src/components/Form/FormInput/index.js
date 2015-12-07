import React, { Component } from 'react';
import styles from './index.css';
import cx from 'classnames';

export default class FormInput extends Component {
  static propTypes = {
    label: React.PropTypes.string,
    valueLink: React.PropTypes.shape({
      value: React.PropTypes.any.isRequired,
      requestChange: React.PropTypes.func.isRequired,
    }),
    onBlur: React.PropTypes.func,
    name: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    type: React.PropTypes.string,
    errorMessage: React.PropTypes.string,
    onChange: React.PropTypes.func,
  };

  render() {
    const classes = cx({
      [styles.editInput]: true,
      [styles.error]: this.props.errorMessage && this.props.errorMessage.length !== 0,
    });
    const ErrorMessage = (() => {
      if (this.props.errorMessage && this.props.errorMessage.length !== 0) {
        return <span className={styles.errorMessage}>{this.props.errorMessage}</span>;
      }
    }());
    return (
      <div className={styles.editRow}>
        <label className={styles.editLabel}>
          {this.props.label}</label>
        <input className={classes}
               valueLink={this.props.valueLink}
               type={this.props.type}
               name={this.props.name}
               placeholder={this.props.placeholder}
               onBlur={this.props.onBlur}
               onChange={this.props.onChange}/>
        {ErrorMessage}
      </div>
    );
  }
}
