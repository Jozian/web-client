import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadLibraries } from '../../actions';
import Table from '../../components/Table/index.js';
import {boldTextRender} from '../../components/Table/renders.js';

@connect (
  (state) => ({libraries: state.libraries}),
  (dispatch) => bindActionCreators({ loadLibraries}, dispatch)
)
export default class LibrariesPage extends Component {

  constructor(props) {
    super(props);
    props.loadLibraries();
  }
    onRowClick(){

    }

    config = {
        columns: [
            {
                key: 'name',
                render: boldTextRender
            }, {
                key: 'folder',
                icon: 'fa fa-folder-open',
                text: 'Folder'
            }, {
                key: 'media',
                icon: 'fa fa-file',
                text: 'Media'
            }, {
                key: 'views',
                icon: 'fa fa-eye',
                text: 'Views'
            }
        ],
        noCheck: false,
    }
  render() {
    console.log("this.props.libraries",this.props)
    return (<div>
      Librares
        <Table ref="table" config={this.config} data={this.props.libraries} onRowClick={::this.onRowClick}/>
    </div>);
  }
}
