import React, { Component } from 'react';
import Button from 'components/Button';
import cx from 'classnames';

import styles from './index.css';

export default class ActionButton extends Component {
  static propTypes = {
    inProgress: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    icon: React.PropTypes.string,
    children: React.PropTypes.node,
    form: React.PropTypes.string,
    type: React.PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
    icon: null,
  };
  render() {
    const disabled = this.props.disabled || this.props.inProgress;
    const className = this.props.inProgress ? 'fa fa-spin fa-cog' : this.props.icon;
    return (
      <Button {...this.props} disabled={disabled} className={cx(className, styles.spinner)} role="button" type={this.props.type} form={this.props.form}>
        {this.props.children}
      </Button>
    );
  }
}
