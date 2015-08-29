import React, { Component, PropTypes } from 'react';
import styles from './checkbox.css';


export default class Checkbox extends Component {

    static propTypes = {
        isChecked: PropTypes.bool.isRequired,
        isDisabled: PropTypes.string,
        onChange: PropTypes.func.isRequired,
    }

    render () {
        const { isChecked, isDisabled } = this.props;
        return (
          <div>
            <lable>
                <input type="checkbox" checked={isChecked} disabled={isDisabled}/>
                <div className={styles.checkBox} onClick={::this.handleClick}></div>
            </lable>
          </div>
        );
    };

    handleClick() {
        this.props.onChange({
            isChecked: !this.props.isChecked})
    }

}

Checkbox.defaultProps = {
    isDisabled: '',
};
