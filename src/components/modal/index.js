import React, { Component } from 'react';
import style from './modal.css';

/* import Button from '...'; */

class Modal extends Component {
  static propTypes = {
    onOkClick: React.PropTypes.func.isRequired,
    onCancelClick: React.PropTypes.func.isRequired,
    isOkDisabled: React.PropTypes.bool,
    title: React.PropTypes.string.isRequired,
    children: React.PropTypes.element.isRequired,
  }
  render() {
    return (
      <div className={style.modalHolder}>
        <div className={style.modalContainer}>
          <h2 className={style.title}> {this.props.title} </h2>

          <div className={style.contentContainer}>
            {this.props.children}
          </div>

          <footer className={style.footer}>
            <button onClick={this.props.onOkClick} text="OK"> </button>
            <button onClick={this.props.onCancelClick} text="Cancel"></button>
          </footer>
        </div>
      </div>
    );
  }
}

export default  Modal;
