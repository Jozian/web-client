import React, { Component, PropTypes } from 'react';
import styles from './checkbox.css';

const typeCheckBox  = {
    def : 'b_body_box',
    head : 'b_head_box'
}

export default class Checkbox extends Component {

    static propTypes = {
        isChecked: PropTypes.bool.isRequired,
        isDisabled: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        type: PropTypes.string,
    }


    render () {
        const { isChecked, isDisabled,type } = this.props;
        return (
          <div>
            <lable>
                <input type="checkbox" checked={isChecked} disabled={isDisabled}/>
                <div className={styles[typeCheckBox[type]]} onClick={::this.handleClick}></div>
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
    isDisable: '',
    type: 'def',
};
