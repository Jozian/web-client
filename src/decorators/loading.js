import React from 'react';

import LoadingSpinner from 'components/LoadingSpinner';

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

export default (isLoading, options) => WrappedComponent => {
  class WrappedLoader extends WrappedComponent {
    static displayName = `SmartLoader.${getDisplayName(WrappedComponent)}`;

    constructor(props, context) {
      super(props, context);
      this.state = {
        ...this.state,
        loading: options.isLoadingByDefault || isLoading(props),
      };
    }

    componentWillReceiveProps(newProps) {
      super.componentWillReceiveProps(newProps);
      this.setState({
        loading: isLoading(newProps),
      });
    }

    render() {
      return (
        <LoadingSpinner loading={this.state.loading}>
          { (this.state.loading) ? null : super.render() }
        </LoadingSpinner>
      );
    }
  }

  return WrappedLoader;
};