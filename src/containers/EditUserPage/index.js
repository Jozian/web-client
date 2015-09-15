import React, { Component, PropTypes } from 'react';
import Button from '../../components/Button';
import {USER_LOADING, USER_LOADED, USER_LOAD_ERROR} from '../../actions/types.js';
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
                  changeHandler={(e) => {this.change(e, 'type')}}>
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

  conditionUtility(error, condition) {
    const errors = [];
    if (!condition) {
      errors.push(error);
    } else {
      const index = errors.indexOf(error);
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
    const errors = this.conditionUtility('already taken', isUnique);
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
    let errors = [];
    return function (newValue) {
      if (field === 'email') {
        errors = this.conditionUtility('wrong format', validator.isEmail(newValue));
      }
      if (field === 'phone') {
        errors = this.conditionUtility('wrong format', validator.isMobilePhone(newValue, 'en-US'));
      }
      if (field === 'name' || field === 'login') {
        errors = this.conditionUtility('required', validator.isLength(newValue, 1));
      }
      if (field === 'confirm') {
        errors = this.conditionUtility('dose not match', validator.equals(this.state.user.password, newValue));
      }
      if (this.state.user[field] !== newValue) {
        const newState = {
          user: {
            ...this.state.user,
            [field]: newValue,
          },
        };
        newState.errors = {
          ...this.state.errors,
          [field]: errors,
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
              name='name'
              placeholder='i.e. John Doe'
              type='text'
              errorMessage={this.state.errors.name}
              onBlur={::this.getBlur}>
            </FormInput>
            <FormInput
              valueLink={{
                value: this.state.user.login,
                requestChange: this.getUserChanger('login'),
              }}
              label='Login*:'
              name='login'
              placeholder='i.e. johndoe'
              type='text'
              errorMessage={this.state.errors.login}
              onBlur={::this.getBlur}>
            </FormInput>
            { this.renderTypesOptions() }
            <FormInput
              valueLink={{
                value: null,
                requestChange: this.getUserChanger('password'),
              }}
              label='Password:'
              name='password'
              placeholder={null}
              type='password'
              errorMessage={this.state.errors.password}>
            </FormInput>
            <FormInput
              valueLink={{
                value: null,
                requestChange: this.getUserChanger('confirm'),
              }}
              label='Confirm Password:'
              name='confirm'
              type='password'
              errorMessage={this.state.errors.confirm}>
            </FormInput>
            <div className={styles.backgroundGreen}>
              <FormInputWithCheckbox
                valueLink={{
                  value: this.state.user.phone,
                  requestChange: this.getUserChanger('phone'),
                }}
                errorMessage={this.state.errors.phone}
                label='Send credentials in SMS:'
                name='phone'
                placeholder='Your mobile phone'
                checked={this.state.checked.phone}
                changeCheckbox={this.check.bind(this, 'phone')}>
              </FormInputWithCheckbox>
              <FormInputWithCheckbox
                valueLink={{
                  value: this.state.user.email,
                  requestChange: this.getUserChanger('email'),
                }}
                errorMessage={this.state.errors.email}
                label='Send credentials in emails:'
                name='email'
                placeholder='email@email.com'
                checked={this.state.checked.email}
                onBlur={::this.getBlur}
                changeCheckbox={this.check.bind(this, 'email')}>
              </FormInputWithCheckbox>
            </div>
            <p className={styles.note}>
              * user will be able to login both to website and mobile client with this credentials.
            </p>
            <footer className={styles.buttonsWrapper}>
              <Button style={styles.buttonStyle}
                      onClick={::this.saveUserHendler}
                      text="OK">
              </Button>
              <Button style={styles.buttonStyle}
                      onClick={::this.cancelUserHendler}
                      text="Cancel">
              </Button>
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
  {USER_LOADING, USER_LOADED, USER_LOAD_ERROR}
)(EditUserPage);
