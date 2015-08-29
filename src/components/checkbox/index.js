import React, { Component, PropTypes } from 'react';
import styles from './checkbox.css';

export default class Checkbox extends Component {
  static propTypes = {
    isChecked: PropTypes.bool.isRequired,
    partialChecked: PropTypes.bool,
    isDisabled: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
  }

  handleClick() {
    this.props.onChange({
      isChecked: !this.props.isChecked,
      partialChecked: false,
    });
  }

  render() {
    const { isChecked, isDisabled, partialChecked } = this.props;
    const name = partialChecked ? styles.partChecked : styles.checked;
    return (
      <div className={this.props.className}>
        <label>
          <input type="checkbox" checked={isChecked} disabled={isDisabled}/>

          <div className={name} onClick={::this.handleClick}></div>
        </label>
      </div>
    );
  }


}

Checkbox.defaultProps = {
  isDisabled: '',
  partialChecked: false,
};
