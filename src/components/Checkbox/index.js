import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
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
    title: PropTypes.string,
  };

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
    const wrapperClasses = cx({
      [styles.checkboxWrapper]: true,
      [this.props.className]: this.props.className !== null,
    });
    const checkboxClasses = cx({
      [styles.checked]: checked !== partiallyChecked,
      [styles.partChecked]: checked === partiallyChecked,
    });
    const currentId = Math.random();
    return (
      <div
        tabIndex={this.props.tabIndex}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onEnterPressed(::this.handleClick)}
        className={wrapperClasses}
      >
        <label htmlFor={currentId} className={styles.hideLabel}>{`Checkbox for ${this.props.title}`}</label>
        <label>
          <input role="checkbox" id={currentId} onChange={::this.handleClick} ref="input" type="checkbox" checked={!!checked} disabled={disabled}/>
          <div className={checkboxClasses}></div>
        </label>
      </div>
    );
  }
}

Checkbox.defaultProps = {
  disabled: false,
};
