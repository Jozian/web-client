import React, { Component } from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';

import styles from './modal.css';

class Modal extends Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    children: React.PropTypes.node.isRequired,
  };


  render() {
    return (
      <ReactModal
        {...this.props}
        overlayClassName={styles.modalOverlay}
        className={cx(styles.modal, this.props.className)}
      >
        <h2 className={styles.title}>{this.props.title}</h2>
        {this.props.children}
      </ReactModal>
    );
  }
}

export default  Modal;
