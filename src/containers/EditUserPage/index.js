import React, { Component, PropTypes } from 'react';
import Button from '../../components/Button';
import {USER_LOADING, USER_LOADED, USER_LOAD_ERROR} from '../../actions/types.js';
import { connect } from 'react-redux';
import styles from './index.css';
import Checkbox from '../../components/Checkbox';
import Dropdown from '../../components/Dropdown';
/*import {connectReduxForm} from 'redux-form';*/
/*import { widgetValidation } from '../../components/Validation/index.js';*/
import * as actions from '../../actions/users.js';
import { bindActionCreators } from 'redux';

@connect(
  (state) =>  ({user: state.user.entity}),
  (dispatch) => bindActionCreators(actions, dispatch)
)

/*@connectReduxForm({
  form: 'widget',
  fields: ['phone', 'email', 'password', 'login', 'name', 'confirm'],
  validate: widgetValidation,
})*/
class EditUserPage extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    /*fields: PropTypes.object.isRequired,
    handleBlur: PropTypes.func.isRequired,*/
    user: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    props.loadUser(props.params.id);
    this.state = {
      loading: true,
      user: {},
      checked: {},
      error: {},
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
      error: {
        name: !props.user.name,
        login: !props.user.login,
        password: !props.user.password,
        confirm: !props.user.confirm,
        email: !props.user.email,
        phone: !props.user.phone,
      },
      errorMessage: {
        /*a: 'required',
        b: 'already taken',
        c: 'dose not match',
        d: 'wrong format',*/
      },
      unique: {
        name: true,
        login: true,
      },
      match: {
        password: true,
        confirm: true,
      },
    });
  }

  saveUserHendler() {
    this.props.editUser(this.props.params.id, this.state.user);
    const { router } = this.context;
    router.transitionTo('users');
  }

  change(event) {
    const user = this.state.user;
    const checked = this.state.checked;
    const key = event.target.name;
    user[key] = event.target.value;
    if (checked.hasOwnProperty(key)) {
      checked[key] = !!user[key];
    }
    this.setState({
      user: user,
      checked: checked,
    });
    /*console.log('change checked', key, this.state.checked);*/
  }

  check(key) {
    const checked = this.state.checked;
    checked[key] = !checked[key];
    this.setState({
      checked: checked,
    });
  }

  validateEmpty(name, value) {
    this.setState({
      error: {
        ...this.state.error,
        [name]: !value,
      },
      errorMessage: {
        required: 'Required',
      },
    });
  }

  unique(key, value) {
    this.props.isUnique({id: this.props.params.id, key:key, value:value });
  }

  match(password, confirm_password) {
  this.setState({
    match: {
      ...this.state.match,
    [name]: !value,
    },
  });
   /* if (password !== confirm_password) {
      console.log('fail');
    }*/
  }

  blur(event) {
    const name = event.target.name;
    this.validateEmpty(name, event.target.value);
    if (event.target.value) {
      this.unique(event.target.name, event.target.value);
    }
    /*if (event.target.name === 'password' || event.target.value) {
      match();
    }*/
  }

  renderInputField(label, name, value, placeholder, type = 'text', validation) {
    const cx = React.addons.classSet;
    const classes = cx({
      [styles.editInput]: true,
      [styles.error]: this.state.error[name] && validation,
    });

    return (
      <div className={styles.editRow}>
        <label className={styles.editLabel}>{label}</label>
        <input className={classes}
               type={type}
               name={name}
               onChange={::this.change}
               placeholder={placeholder}
               value={value}
               onBlur={::this.blur}/>
        <span>{this.state.errorMessage}</span>
      </div>
    );
  }

  renderInputFieldWithCheckbox(label, name, value, placeholder, type = 'text') {
    const cx = React.addons.classSet;
    const classes = cx({
      [styles.editInput]: true,
      [styles.checkboxInput]: true,
      [styles.disabled]: !this.state.checked[name],
    });
    return (
      <div className={styles.editRow}>
        <div className={styles.editCheckbox}>
          <Checkbox title={label}
                    onChange={this.check.bind(this, name)}
                    isChecked={this.state.checked[name]}/>
        </div>
        <input
          className={classes}
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={(e) => {this.change(e, name)}}
          value={value}/>
      </div>
    );
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

  render() {
    return (
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>Edit user</h1>

        <div className={styles.wrapper}>
          <form name="widget" className={styles.backgroundGrey}>
            { this.renderInputField('User Name:', 'name', this.state.user.name,
              'i.e. John Doe', 'text', true) }

            { this.renderInputField('Login*:', 'login', this.state.user.login,
              'i.e. johndoe', 'text', true) }

            { this.renderTypesOptions() }

            { this.renderInputField('Password:', 'password',
              null, null, 'password', false) }

            { this.renderInputField('Confirm Password:', 'confirm-password',
              null, null, 'password', false) }

            <div className={styles.backgroundGreen}>
              { this.renderInputFieldWithCheckbox('Send credentials in SMS:',
                'phone', this.state.user.phone, 'Your mobile phone', 'phone') }

              { this.renderInputFieldWithCheckbox('Send credentials in emails:',
                'email', this.state.user.email, 'email@email.com', 'email') }
            </div>
            <p className={styles.note}>
              * user will be able to login both to website and mobile client with this credentials.
            </p>
            <footer className={styles.buttonsWrapper}>
              <Button style={styles.buttonStyle}
                      onClick={::this.saveUserHendler}
                      text="OK"
                />
              <Button style={styles.buttonStyle}
                      text="Cancel"/>
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
