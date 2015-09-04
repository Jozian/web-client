import React, { Component } from 'react';
import { mapValues, isEqual } from 'lodash';

function wrapBindings(bindings) {
  return mapValues(bindings, binding => new WinJS.Binding.List(binding));
}

function getDisplayName(C) {
  return C.displayName || C.name || 'Component';
}

export default propsToBindings => WrappedComponent => {
  class Wrapper extends Component {
    static displayName = `WinJSBinding.${getDisplayName(WrappedComponent)}`;

    constructor(props) {
      super(props);
      const bindings = propsToBindings(props);
      this.state = {
        bindings,
        lists: wrapBindings(bindings),
      };
    }

    componentWillReceiveProps(nextProps) {
      const bindings = propsToBindings(nextProps);
      // FIXME: change to one-level comparator
      if (!isEqual(bindings, this.state.bindings)) {
        this.setState({
          bindings: bindings,
          lists: wrapBindings(bindings),
        });
      }
    }

    render() {
      return (<WrappedComponent
        {...this.state.lists} {...this.props}
      />);
    }
  }

  return Wrapper;
};
