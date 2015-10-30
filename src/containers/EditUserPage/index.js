import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from 'components/Button';
import { isUnique } from 'api/users.js';
import Dropdown from 'components/Dropdown';
import FormInput from 'components/Form/FormInput';
import Header from 'components/Header';
import Footer from 'components/Footer';
import * as actions from 'actions/users.js';
import loading from 'decorators/loading';
import validator from 'validator';
import Footer from 'components/Footer';
import WhiteFooter from 'components/WhiteFooter';
import Modal from 'components/Modal';
import ActionButtonForModal from 'components/ActionButtonForModal';

import styles from './index.css';
import commonStyles from 'common/styles.css';

@connect(
  (state) =>  ({user: state.user.entity, currentUser: state.currentUser }),
  (dispatch) => bindActionCreators(actions, dispatch)
)
@loading(
  (state) => state.user.loading,
  {isLoadingByDefault: true}
)
export default class EditUserPage extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
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
    if (props.params.id) {
      props.loadUser(props.params.id);
    } else {
      props.newUser();
      this.state.user.type = 'admin';
    }
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
    if (props.params.id) {
      this.setState({
        user: props.user,
        checked: {
          phone: !!props.user.phone,
          email: !!props.user.email,
        },
      });
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

  async saveUserHandler() {
    const { router } = this.context;
    let required = ['name', 'login', 'password'];
    let newState = {
      errors: this.state.errors,
    };
    if (this.props.params.id) {
      required.pop();
    }
    required.forEach((key) => {
      newState.errors[key] = this.composeErrorMessages(
        key, 'required', validator.isLength(this.state.user[key], 1));
    });

    this.setState(newState);
    let errorsSave = [];
    _(this.state.errors).forEach(function(val, key) {
      if (val.length) {
        errorsSave.push(val);
      }
    }, this).value();
    if (!errorsSave.length) {
      if (this.props.params.id) {
        if (this.props.params.id === this.props.currentUser.id.toString() && this.state.user.type !== 'admin') {
          let isAdminResult = await this.props.isLastAdmin();
          if (isAdminResult.payload) {
            this.setState({
              isOpenLastAdminModal: true,
            });
          } else {
            await this.props.editUser(this.props.params.id, this.state.user);
            router.transitionTo('users');
          }
        }
      } else {
        await this.props.addUser(this.state.user);
        router.transitionTo('users');
      }
    }
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

  change(event) {
    const user = this.state.user;
    const key = event.target.name;
    user[key] = event.target.value;
    this.setState({
      user: user,
    });
  }

  renderTypesOptions() {
    return (
      <Dropdown title="Type:"
                value={this.state.user.type}
                disabled={this.state.user.type === 'owner'}
                onChange={(e) => {this.change(e, 'type')}}>
        {
          (this.types || []).filter((type) => (this.state.user.type === 'owner' || type.value !== 'owner')
          ).map((type) => (<option value={type.value}>{type.label}</option>))
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
        const item = await isUnique({id: this.props.params.id, key: key, value: value});
        return item.isUnique;
      } catch (_x_) {
        console.error(_x_);
        return;
      }
    }
  }

  async onBlur(event) {
    const key = event.target.name;
    const value = event.target.value;
    let errors = [];
    if (value && this.props.user[key] !== value) {
      const isUnique = await this.validateUnique(key, value);
      errors = this.composeErrorMessages(key, 'already taken', isUnique);
      this.setUser(key, value);
      this.setErrors(key, errors);
    }
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
        if (!this.props.params.id) {
          [message, isValid] = ['required', validator.isLength(newValue, 1)];
          this.state.errors[field] = this.composeErrorMessages(field, message, isValid);
        }
        key = 'confirm';
        [message, isValid] = ['does not match', validator.equals(this.state.user.confirm, newValue)];
      }
      const errors = this.composeErrorMessages(key, message, isValid);
      if (this.state.user[field] !== newValue) {
        this.setUser(field, newValue);
        this.setErrors(key, errors);
      }
    }.bind(this);
  }

  setUser(field, value) {
    this.setState({
      user: {
        ...this.state.user,
        [field]: value,
      },
    });
  }

  setErrors(field, errors) {
    this.setState({
      errors: {
        ...this.state.errors,
        [field]: errors,
      },
    });
  }

  hideLastAdminPopup() {
    this.setState({
      isOpenLastAdminModal: false,
    });
  }

  renderLastAdminModal() {
    return (<Modal
      isOpen={this.state.isOpenLastAdminModal}
      title="This is the last account with Admin role. The role can not be changed since the control over instance will be lost."
      className={styles.newLibraryModal}
      >
      <WhiteFooter>
        <ActionButtonForModal
          className={commonStyles.saveButtonModal}
          onClick={::this.hideLastAdminPopup}
          >
          Ok
        </ActionButtonForModal>
      </WhiteFooter>
    </Modal>);
  }

  render() {
      return (
        <div className={styles.mainContainer}>
          { this.renderLastAdminModal() }
          <Header>Add user</Header>
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

            <footer className={styles.buttonsWrapper}>
              <Button className={styles.buttonStyle}
                      onClick={::this.saveUserHandler}
                      text="OK"/>
              <Button className={styles.buttonStyle}
                      onClick={::this.cancelUserHandler}
                      text="Cancel"/>
            </footer>
          </form>
        </div>
      </div>);
  }
}

