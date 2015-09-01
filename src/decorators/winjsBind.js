import React, { Component } from 'react';
import { mapValues } from 'lodash';

function wrapBindings(bindings) {
  return mapValues(bindings, binding => new WinJS.Binding.List(binding));
}

export default propsToBindings => WrappedComponent => {
  class Wrapper extends Component {
    constructor(props) {
      super(props);
      this.state = {
        bindings: wrapBindings(propsToBindings(props)),
      };
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        bindings: wrapBindings(propsToBindings(nextProps)),
      });
    }

    render() {
      return (<WrappedComponent
        {...this.state.bindings} {...this.props}
      />);
    }
  }

  return Wrapper;
};
