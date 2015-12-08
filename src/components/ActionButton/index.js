import React, { Component } from 'react';
import Button from 'components/Button';

export default class ActionButton extends Component {
  static propTypes = {
    inProgress: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    icon: React.PropTypes.string,
    children: React.PropTypes.node,
  };

  static defaultProps = {
    disabled: false,
    icon: null,
  };
  render() {
    const disabled = this.props.disabled || this.props.inProgress;
    const className = this.props.inProgress ? 'fa fa-spin fa-cog' : this.props.icon;
    return (
      <Button {...this.props} disabled={disabled} className={className} role="button">
        {this.props.children}
      </Button>
    );
  }
}
