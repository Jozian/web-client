import React, { Component, PropTypes } from 'react';

import { onEnterPressed } from 'common';
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

  handleClick(event) {
    this.props.onChange({
      checked: !(this.props.checked === false),
    }, event);
  }

  render() {
    const { checked, disabled } = this.props;
    const className = checked === partiallyChecked ? styles.partChecked : styles.checked;
    return (
      <div
        tabIndex={this.props.tabIndex}
        onClick={(event) => event.stopPropagation()}
        onKeyPress={onEnterPressed(::this.handleClick)}
        className={this.props.className}
      >
        <label>
          <input onChange={::this.handleClick} ref="input" type="checkbox" checked={!!checked} disabled={disabled}/>
          <div className={className}></div>
        </label>
        <label className={styles.title}>{this.props.className}</label>
      </div>
    );
  }


}

Checkbox.defaultProps = {
  disabled: false,
};
