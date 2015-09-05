import React, { Component } from 'react';
import ReactDocumentTitle from 'react-document-title';

export default class DocumentTitle extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
  }

  render() {
    return <ReactDocumentTitle title={`${this.props.title} | Microsoft Education Delivery`} />;
  }
}
