import React, { Component, PropTypes } from 'react';
import Button from '../../components/Button';
import { connect } from 'react-redux';
import styles from './index.css';
import Dropdown from '../../components/Dropdown';
import FormInput from '../../components/Form/FormInput';
import FormInputWithCheckbox from '../../components/Form/FormInputWithCheckbox';
import * as actions from '../../actions/users.js';
import { bindActionCreators } from 'redux';
import loading from 'decorators/loading';
import validator from 'validator';

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
      oldValues: {},
      errors: {
        name: [],
        login: [],
        password: [],
        confirm: [],
        email: [],
        phone: [],
      },
    };
    this.values = [{
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
      oldValues: {
        name: props.user.name,
        login: props.user.login,
        email: props.user.email,
        phone: props.user.phone,
      },
    });
  }

  saveUserHendler() {
    this.props.editUser(this.props.params.id, this.state.user);
    const { router } = this.context;
    router.transitionTo('users');
  }

  cancelUserHendler() {
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

  renderTypesOptions() {
    return (
        <Dropdown title="Type:"
                  isDisabled={this.state.user.type === 'owner'}
                  onChange={(e) => {this.change(e, 'type')}}>
          {
            (this.values || []).filter((type) =>
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
      return true;
    }
    const oldValue = this.state.oldValues[key];
    if (value === oldValue) {
      return true;
    } else {
      try {
        const item = await this.props.isUnique( {id: this.props.params.id, key: key, value: value} );
        return item.payload.isUnique;
      } catch (e) {
        console.error(e);
        return;
      }
    }
  }

  composeErrorMessages(key, message, condition) {
    const errors = [...this.state.errors[key]];
    if (!condition) {
      errors.push(message);
    } else {
      const index = errors.indexOf(message);
      if (index !== -1) {
        errors.splice(index, 1);
      }
    }
    return errors;
  }

  async getBlur(event) {
    const key = event.target.name;
    const value = event.target.value;
    const isUnique = await this.validateUnique(key, value);
    const errors = this.composeErrorMessages(key, 'already taken', isUnique);
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

  getUserChanger(field) {
    return function (newValue) {
      let message = '';
      let isValid = true;
      if (field === 'email') {
        [message, isValid] = ['wrong format', validator.isEmail(newValue)];
      } else if (field === 'phone') {
        [message, isValid] = ['wrong format', validator.isMobilePhone(newValue, 'en-US')];
      } else if (field === 'name' || field === 'login') {
        [message, isValid] = ['required', validator.isLength(newValue, 1)];
      } else if (field === 'confirm') {
        [message, isValid] = ['does not match', validator.equals(this.state.user.password, newValue)];
      }
      const errors = this.composeErrorMessages(field, message, isValid);

      if (this.state.user[field] !== newValue) {
        const newState = {
          user: {
            ...this.state.user,
            [field]: newValue,
          },
          errors: {
            ...this.state.errors,
            [field]: errors,
          }
        };
        this.setState(newState);
      }
    }.bind(this);
  }

  render() {
    return (
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>Edit user</h1>
        <div className={styles.wrapper}>
          <form className={styles.backgroundGrey}>
            <FormInput
              valueLink={{
                value: this.state.user.name,
                requestChange: this.getUserChanger('name'),
              }}
              label="User Name:"
              name="name"
              placeholder="i.e. John Doe"
              type="text"
              errorMessage={this.state.errors.name}
              onBlur={::this.getBlur} />
            <FormInput
              valueLink={{
                value: this.state.user.login,
                requestChange: this.getUserChanger('login'),
              }}
              label="Login*:"
              name="login"
              placeholder="i.e. johndoe"
              type="text"
              errorMessage={this.state.errors.login}
              onBlur={::this.getBlur} />
            { this.renderTypesOptions() }
            <FormInput
              valueLink={{
                value: null,
                requestChange: this.getUserChanger('password'),
              }}
              label="Password:"
              name="password"
              placeholder={null}
              type="password"
              errorMessage={this.state.errors.password} />
            <FormInput
              valueLink={{
                value: null,
                requestChange: this.getUserChanger('confirm'),
              }}
              label="Confirm Password:"
              name="confirm"
              type="password"
              errorMessage={this.state.errors.confirm} />
            <div className={styles.backgroundGreen}>
              <FormInputWithCheckbox
                valueLink={{
                  value: this.state.user.phone,
                  requestChange: this.getUserChanger('phone'),
                }}
                errorMessage={this.state.errors.phone}
                label="Send credentials in SMS:"
                name="phone"
                placeholder="Your mobile phone"
                checked={this.state.checked.phone}
                changeCheckbox={this.check.bind(this, 'phone')} />
              <FormInputWithCheckbox
                valueLink={{
                  value: this.state.user.email,
                  requestChange: this.getUserChanger('email'),
                }}
                errorMessage={this.state.errors.email}
                label="Send credentials in emails:"
                name="email"
                placeholder="email@email.com"
                checked={this.state.checked.email}
                onBlur={::this.getBlur}
                changeCheckbox={this.check.bind(this, 'email')} />
            </div>
            <p className={styles.note}>
              * user will be able to login both to website and mobile client with this credentials.
            </p>
            <footer className={styles.buttonsWrapper}>
              <Button className={styles.buttonStyle}
                      onClick={::this.saveUserHendler}
                      text="OK" />
              <Button className={styles.buttonStyle}
                      onClick={::this.cancelUserHendler}
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

export default connect(mapStateToProps)(EditUserPage);
