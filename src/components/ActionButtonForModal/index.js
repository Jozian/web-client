import React, { Component } from 'react';
import Button from 'components/Button';

export default class ActionButtonForModal extends Component {
  static propTypes = {
    inProgress: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    children: React.PropTypes.node,
  }

  static defaultProps = {
    disabled: false,
  };

  render() {
    const disabled = this.props.disabled || this.props.inProgress;
    const className = this.props.inProgress ? 'fa fa-spin fa-cog' : '';
    return (
      <Button {...this.props} disabled={disabled}>
        {this.props.children}
      </Button>
    );
  }
}
