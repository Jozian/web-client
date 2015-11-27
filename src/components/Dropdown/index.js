import React, { Component, PropTypes } from 'react';
import styles from './index.css';
import fontAwesome from 'font-awesome-webpack'; // eslint-disable-line no-unused-vars

export default class Dropdown extends Component {
    static propTypes = {
        title: PropTypes.string,
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        value: PropTypes.string,
        role: PropTypes.string,
    };

    render() {
        return (
            <div className={styles.editUser}>
                <label className={styles.userLabel}>{this.props.title}</label>
                <select className={styles.optionsSelect} name="type"
                        disabled={this.props.disabled}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        role={this.props.role}
                        required>
                    {this.props.children}
                </select>
            </div>
        );
    }
}