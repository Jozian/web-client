/* Validation
 email: {
 re: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
 unique: true
 },
 name: {
 required: true,
 unique: true
 },
 login: {
 required: true,
 unique: true
 },
 password: {
 required: true
 },
 confirm: {
 match: true
 },
 phone: {
 re:  /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\. \\\/]?)?((?:\(?\d+\)?[\-\. \\\/]?)*)(?:[\-\. \\\/]?(?:#|ext\.?|extension|x)[\-\. \\\/]?(\d+))?$/i,
 unique: false
 }
 */
import * as actions from '../../actions/users.js';

const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => value => rules.map(rule => rule(value)).filter(error => !!error)[0 /* first error */];

export function email(value) {
  if (!isEmpty(value) && !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
    console.log('Invalid email address');
    return 'Invalid email address';
  }
}

export function phone(value) {
  if (!/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\. \\\/]?)?((?:\(?\d+\)?[\-\. \\\/]?)*)(?:[\-\. \\\/]?(?:#|ext\.?|extension|x)[\-\. \\\/]?(\d+))?$/i.test(value)) {
    console.log('Invalid phone');
    return 'Invalid phone';
  }
}

export function required(value) {
  if (isEmpty(value)) {
    console.log('Required');
    return 'Required';
  }
}

export function match(password, confirm) {
  /*if (password !== confirm) {
    console.log('Does not match');
    return 'Does not match';
  }*/
}

export function unique(value) {
  /*if (isUnique(value)) {
    return 'Must be unique';
  }*/
}


export function createValidator(rules) {
  return (data = {}) => {
    const errors = {valid: true};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key]);
      if (error) {
        errors[key] = error;
        errors.valid = false;
      }
    });
    return errors;
  };
}