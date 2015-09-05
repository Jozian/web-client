import React, { Component, PropTypes } from 'react';

import { onEnterClick } from 'common';
import styles from './checkbox.css';

export const partiallyChecked = Symbol('Paritally checked');

export default class Checkbox extends Component {
  static propTypes = {
    checked: PropTypes.any,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    tabIndex: PropTypes.string,
  }

  static defaultProps = {
    tabIndex: '-1',
  }

  handleClick() {
    this.props.onChange({
      checked: !(this.props.checked === false),
    });
  }

  render() {
    const { checked, disabled } = this.props;
    const className = checked === partiallyChecked ? styles.partChecked : styles.checked;
    return (
      <div tabIndex={this.props.tabIndex} onKeyPress={onEnterClick(::this.handleClick)} className={this.props.className}>
        <label>
          <input type="checkbox" onChange={::this.handleClick} checked={!!checked} disabled={disabled}/>
          <div className={className}></div>
        </label>
      </div>
    );
  }
}

Checkbox.defaultProps = {
  disabled: false,
};
