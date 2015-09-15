import React, { Component, PropTypes } from 'react';
import styles from './index.css';
import fontAwesome from 'font-awesome-webpack'; // eslint-disable-line no-unused-vars

export default class Dropdown extends Component {
    static propTypes = {
        title: PropTypes.string,
        onChange: PropTypes.func,
        isDisabled: PropTypes.bool,
    };

    render() {
        return (
            <div className={styles.editUser}>
                <label className={styles.userLabel}>{this.props.title}</label>
                <select className={styles.optionsSelect} name="type"
                      disabled={this.props.isDisabled}
                      onChange={this.props.onChange}>
                    {this.props.children}
                </select>
            </div>
        );
    }
}