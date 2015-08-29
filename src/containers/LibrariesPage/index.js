import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadLibraries } from '../../actions';

@connect(
  (state) => ({libraries: state.libraries}),
  (dispatch) => bindActionCreators({ loadLibraries}, dispatch)
)
export default class LibrariesPage extends Component {

  constructor(props) {
    super(props);
    props.loadLibraries();
  }

  render() {
    return (<div>
      Librares
    </div>);
  }
}
