import React, { Component, PropTypes } from 'react';
import Button from 'components/Button';
import { connect } from 'react-redux';
import styles from './index.css';
import { isUnique } from 'api/users.js';
import Dropdown from 'components/Dropdown';
import FormInput from 'components/Form/FormInput';
import Header from 'components/Header';
import FormInputWithCheckbox from 'components/Form/FormInputWithCheckbox';
import * as actions from 'actions/users.js';
import { bindActionCreators } from 'redux';
import loading from 'decorators/loading';
import validator from 'validator';

@connect(
  (state) =>  ({user: state.user.entity}),
  (dispatch) => bindActionCreators(actions, dispatch)
)

class AddUserPage extends Component {
  static propTypes = {
    user: PropTypes.object,
  };
  static contextTypes = {
    router: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.linkState = React.addons.LinkedStateMixin.linkState.bind(this);
    this.state = {
      loading: true,
      user: {
        type: 'admin',
      },
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

  saveUserHandler() {
    this.props.addUser(this.state.user);
    console.log(this.state.user);
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
      <Dropdown title="Type:"
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
        const item = await isUnique( {key: key, value: value} );
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
    if (value !== '') {
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
        [message, isValid] = ['required', validator.isLength(newValue, 1)];
      } else if (field === 'password') {
        key = 'confirm';
        [message, isValid] = ['does not match', validator.equals(this.state.user.confirm, newValue)];
        [message, isValid] = ['required', validator.isLength(newValue, 1)];
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
          <Header>Add User Account</Header>
          <div className={styles.wrapper}>
            <form className={styles.backgroundGrey}>
              <FormInput
                valueLink={{
                value: this.state.user.name,
                requestChange: this.getUserChange('name'),
              }}
                label="User Name:"
                name="name"
                placeholder="i.e. John Doe"
                type="text"
                errorMessage={this.state.errors.name}
                onBlur={::this.onBlur} />
              <FormInput
                valueLink={{
                value: this.state.user.login,
                requestChange: this.getUserChange('login'),
              }}
                label="Login*:"
                name="login"
                placeholder="i.e. johndoe"
                type="text"
                errorMessage={this.state.errors.login}
                onBlur={::this.onBlur} />
              { this.renderTypesOptions() }
              <FormInput
                valueLink={{
                value: null,
                requestChange: this.getUserChange('password'),
              }}
                label="Password:"
                name="password"
                placeholder={null}
                type="password"
                errorMessage={this.state.errors.password} />
              <FormInput
                valueLink={{
                value: null,
                requestChange: this.getUserChange('confirm'),
              }}
                label="Confirm Password:"
                name="confirm"
                type="password"
                errorMessage={this.state.errors.confirm} />
              <div className={styles.backgroundGreen}>
                <FormInputWithCheckbox
                  valueLink={{
                  value: this.state.user.phone,
                  requestChange: this.getUserChange('phone'),
                }}
                  errorMessage={this.state.errors.phone}
                  label="Send credentials in SMS:"
                  name="phone"
                  placeholder="Your mobile phone"
                  checked={this.state.checked.phone}
                  onCheckboxChange={this.check.bind(this, 'phone')} />
                <FormInputWithCheckbox
                  valueLink={{
                  value: this.state.user.email,
                  requestChange: this.getUserChange('email'),
                }}
                  errorMessage={this.state.errors.email}
                  label="Send credentials in emails:"
                  name="email"
                  placeholder="email@email.com"
                  checked={this.state.checked.email}
                  onBlur={::this.onBlur}
                  onCheckboxChange={this.check.bind(this, 'email')} />
              </div>
              <p className={styles.note}>
                * user will be able to login both to website and mobile client with this credentials.
              </p>
              <footer className={styles.buttonsWrapper}>
                <Button className={styles.buttonStyle}
                        onClick={::this.saveUserHandler}
                        text="OK" />
                <Button className={styles.buttonStyle}
                        onClick={::this.cancelUserHandler}
                        text="Cancel" />
              </footer>
            </form>
          </div>
        </div>);
    }
}

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(AddUserPage);
