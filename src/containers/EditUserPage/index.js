import React, { Component } from 'react';
import Button from '../../components/Button';
import {USER_LOADING, USER_LOADED, USER_LOAD_ERROR} from '../../actions/types.js';
import { connect } from 'react-redux';
import style from './index.css';
//import Input from '../../components/Input';
import Checkbox from '../../components/Checkbox';
import Dropdown from '../../components/Dropdown';
import * as actions from '../../actions/users.js';
import { bindActionCreators } from 'redux';

@connect(
  (state) => ({user: state.user}),
  (dispatch) => bindActionCreators(actions, dispatch)
)

class EditUserPage extends Component {

    static propTypes = {
        params: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            login: React.PropTypes.string.isRequired,
            name: React.PropTypes.string.isRequired,
            type: React.PropTypes.string.isRequired,
        }),
    }

    constructor(props) {
        super(props);
        props.loadUser(props.params.id);
        this.state = { loading: true };
    }

    render() {
        return (<div className={style.mainContainer}>
            <h1 className={style.title}>Edit user</h1>
            <div className={style.wrapper}>
              <form className={style.backgroundGrey}>
                <div className={style.editRow}>
                  <label className={style.editLabel}>User Name:</label>
                  <input
                    className={style.editInput}
                    type="text"
                    name="name"
                    placeholder="i.e. John Doe"
                    value={this.props.user.entity.name}></input>
                </div>
                <div className={style.editRow}>
                  <label className={style.editLabel}>Login*:</label>
                  <input
                    className={style.editInput}
                    type="text"
                    name="login"
                    placeholder="i.e. johndoe"
                    value={this.props.user.entity.login}></input>
                </div>
                <Dropdown title="Type:">
                  <option selected value="type">{this.props.user.entity.type}</option>
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                  <option value="mobile">Mobile</option>
                </Dropdown>
                <div className={style.editRow}>
                  <label className={style.editLabel}>Password:</label>
                  <input
                    className={style.editInput}
                    type="password"
                    name="password">
                  </input>
                </div>
                <div className={style.editRow}>
                  <label className={style.editLabel}>Confirm Password:</label>
                  <input
                    className={style.editInput}
                    type="password"
                    name="confirm-password">
                  </input>
                </div>
                <div className={style.backgroundGreen}>

                  <div className={style.editRow}>
                    <Checkbox className={style.editCheckbox} title="Send credentials in SMS:"></Checkbox>
                    <input
                      className={style.editInput}
                      type="text"
                      name="name"
                      placeholder="Your mobile phone"
                      value={this.props.user.entity.phone}>
                    </input>
                  </div>

                  <div className={style.editRow}>
                    <Checkbox className={style.editCheckbox} title="Send credentials in emails:"></Checkbox>
                    <input
                      className={style.editInput}
                      type="text"
                      name="name"
                      placeholder="email@email.com"
                      value={this.props.user.entity.email}>
                    </input>
                  </div>
                </div>
                <footer>
                  <p className={style.note}>* user will be able to login both to website and mobile client with this credentials.</p>
                  <p><input type="submit" value="OK"></input></p>
                  <p><input type="submit" value="Cancel"></input></p>
                </footer>
              </form>
            </div>
        </div>);
    }
}

function mapStateToProps() {
    return {};
}


export default connect(
    mapStateToProps,
    { USER_LOADING, USER_LOADED, USER_LOAD_ERROR }
)(EditUserPage);