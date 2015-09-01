import React, { Component } from 'react';
import Button from '../../components/Button';
import {USERS_LOADING, USERS_LOADED, USERS_LOAD_ERROR} from '../../actions/types.js';
import { connect } from 'react-redux';
import style from './index.css';
import IconButton from '../../components/IconButton';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Checkbox from '../../components/Checkbox';
import Dropdown from '../../components/Dropdown';
import * as actions from '../../actions/users.js';
import { bindActionCreators } from 'redux';

class EditUserPage extends Component {
    render() {
        return (<Modal title="Edit User">
            <div className={style.backgroundGrey}>
                <Input title="User Name:" placeholder="i.e. John Doe"></Input>
                <Input title="Login*:" placeholder="i.e. johndoe"></Input>
                <Dropdown title="Type:"></Dropdown>
                <Input title="Password:"></Input>
                <Input title="Confirm Password:"></Input>
                <div className={style.backgroundGreen}>
                    <Checkbox className="Send credentials in SMS:"></Checkbox>
                    <div className={style.editRow}>
                        <input className={style.editInput} type="text" name="name" placeholder="Your mobile phone"></input>
                    </div>
                    <Checkbox className="Send credentials in emails:"></Checkbox>
                    <div className={style.editRow}>
                        <input className={style.editInput} type="text" name="name" placeholder="email@email.com"></input>
                    </div>
                </div>
                <p className={style.note}>* user will be able to login both to website and mobile client with this credentials.</p>
            </div>
        </Modal>);
    }
}

function mapStateToProps() {
    return {};
}

export default connect(
    mapStateToProps,
    { USERS_LOADING, USERS_LOADED, USERS_LOAD_ERROR }
)(EditUserPage);