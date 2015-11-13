import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from 'components/Button';
import { isUnique } from 'api/users.js';
import Dropdown from 'components/Dropdown';
import FormInput from 'components/Form/FormInput';
import Header from 'components/Header';
import FormInputWithCheckbox from 'components/Form/FormInputWithCheckbox';
import * as actions from 'actions/users.js';
import loading from 'decorators/loading';
import validator from 'validator';
import Footer from 'components/Footer';

import styles from './index.css';

@connect(
  (state) =>  ({user: state.user.entity}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
@loading(
  (state) => state.user.loading,
  { isLoadingByDefault: true }
)
class EditUserPage extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    user: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.linkState = React.addons.LinkedStateMixin.linkState.bind(this);
    props.loadUser(props.params.id);
    this.state = {
      loading: true,
      user: {},
      checked: {},
      errors: {
        name: [],
        login: [],
        password: [],
        confirm: [],
        email: [],
        phone: [],
      },
    };
    this.types = [{
      value: 'admin',
      label: 'Admin',
    }, {
      value: 'operator',
      label: 'Operator',
    }, {
      value: 'mobile',
      label: 'Mobile',
    }, {
      value: 'owner',
      label: 'Owner (Super Admin)',
    }];
  }

  componentWillReceiveProps(props) {
    this.setState({
      user: props.user,
      checked: {
        phone: !!props.user.phone,
        email: !!props.user.email,
      },
    });
  }

  async saveUserHandler() {
    await this.props.editUser(this.props.params.id, this.state.user);
    const { router } = this.context;
    router.transitionTo('users');
  }

  cancelUserHandler() {
    const { router } = this.context;
    router.transitionTo('users');
  }

  check(key, data, event) {
    const checked = this.state.checked;
    checked[key] = !checked[key];
    this.setState({
      checked: checked,
    });
  }

  change(e, type) {
    this.props.user.type = type[e.target.selectedIndex].value;
  }

  renderTypesOptions() {
    return (
        <Dropdown title="Type"
                  disabled={this.state.user.type === 'owner'}
                  onChange={(e) => {this.change(e, this.types)}}>
          {
            (this.types || []).filter((type) =>
                (this.state.user.type === 'owner' || type.value !== 'owner')
            ).map((type) =>
                (<option value={type.value} selected={type.value === this.state.user.type}>{type.label}</option>)
            )
          }
        </Dropdown>
    );
  }

  async validateUnique(key, value) {
    if (!value) {
      return false;
    }
    const oldValue = this.props.user[key];
    if (value === oldValue) {
      return false;
    } else {
      try {
        const item = await isUnique( {id: this.props.params.id, key: key, value: value} );
        return item.isUnique;
      } catch (_x_) {
        console.error(_x_);
        return;
      }
    }
  }

  composeErrorMessages(key, message, condition) {
    const errors = [...this.state.errors[key]];
    if (!condition) {
      if (!errors.includes(message)) {
        errors.push(message);
      }
    } else {
      const index = errors.indexOf(message);
      if (index !== -1) {
        errors.splice(index, 1);
      }
    }
    return errors;
  }

  async onBlur(event) {
    const key = event.target.name;
    const value = event.target.value;
    let errors = [];
    if (this.props.user[key] !== value) {
      const isUnique = await this.validateUnique(key, value);
      errors = this.composeErrorMessages(key, 'already taken', isUnique);
    }
    const newState = {
        user: {
          ...this.state.user,
        [key]: value,
      },
      errors: {
        ...this.state.errors,
        [key]: errors,
        }
        };
    this.setState(newState);
  }

  getUserChange(field) {
    return function (newValue) {
      let message = '';
      let isValid = true;
      let key = field;
      if (field === 'email') {
        [message, isValid] = ['wrong format', validator.isEmail(newValue)];
      } else if (field === 'phone') {
        [message, isValid] = ['wrong format', validator.isMobilePhone(newValue, 'en-US')];
      } else if (field === 'name' || field === 'login') {
        [message, isValid] = ['required', validator.isLength(newValue, 1)];
      } else if (field === 'confirm') {
        [message, isValid] = ['does not match', validator.equals(this.state.user.password, newValue)];
      } else if (field === 'password') {
        key = 'confirm';
        [message, isValid] = ['does not match', validator.equals(this.state.user.confirm, newValue)];
      }
      const errors = this.composeErrorMessages(key, message, isValid);
      if (this.state.user[field] !== newValue) {
        const newState = {
          user: {
            ...this.state.user,
            [field]: newValue,
          },
          errors: {
            ...this.state.errors,
            [key]: errors,
          },
        };
        this.setState(newState);
      }
    }.bind(this);
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <Header>Edit user</Header>
        <div className={styles.wrapper}>
          <form className={styles.backgroundWhite}>
            <div className={styles.leftBlock}>
              { this.renderTypesOptions() }
              <FormInput
                valueLink={{
                value: this.state.user.name,
                requestChange: this.getUserChange('name'),
              }}
                label="User name"
                name="name"
                placeholder="i.e. John Doe"
                type="text"
                errorMessage={this.state.errors.name}
                onBlur={::this.onBlur} />
              <FormInput
                valueLink={{
                  value: null,
                  requestChange: this.getUserChange('password'),
                }}
                label="Password"
                name="password"
                placeholder={null}
                type="password"
                errorMessage={this.state.errors.password} />
              <FormInput
                valueLink={{
                    value: this.state.user.email,
                    requestChange: this.getUserChange('email'),
                  }}
                label="Send credentials on Email"
                errorMessage={this.state.errors.email}
                name="email"
                placeholder="email@email.com"
                />
            </div>


            <div className={styles.rightBlock}>
              <FormInput
                valueLink={{
                value: this.state.user.login,
                requestChange: this.getUserChange('login'),
              }}
                label="Login"
                name="login"
                placeholder="i.e. johndoe"
                type="text"
                errorMessage={this.state.errors.login}
                onBlur={::this.onBlur} />
              <FormInput
                valueLink={{
                  value: null,
                  requestChange: this.getUserChange('confirm'),
                }}
                label="Confirm password"
                name="confirm"
                type="password"
                errorMessage={this.state.errors.confirm} />
                <FormInput
                  valueLink={{
                    value: this.state.user.phone,
                    requestChange: this.getUserChange('phone'),
                  }}
                  label="Send credentials in SMS"
                  errorMessage={this.state.errors.phone}
                  name="phone"
                  placeholder="Your mobile phone"
                   />
              </div>
            <p className={styles.note}>
              * user will be able to login both to website and mobile client with this credentials.
            </p>

          </form>

        </div>
        <Footer>
          <Button className="mdl2-check-mark"
                  onClick={::this.saveUserHandler}
                   />
          <Button className="mdl2-cancel"
                  onClick={::this.cancelUserHandler}
                  />
      </Footer>
      </div>);
  }
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(EditUserPage);
