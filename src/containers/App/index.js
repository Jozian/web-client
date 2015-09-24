import React, { Component } from 'react';
import { RouteHandler } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions/apps';
import Modal from 'components/Modal';
import NavBar from 'components/NavBar';
import ToastManager from '../ToastManager';
import WhiteFooter from 'components/WhiteFooter';
import ActionButtonForModal from 'components/ActionButtonForModal';
import SearchBar from 'components/SearchBar';

import styles from './index.css';
import commonStyles from 'common/styles.css';

@connect(
  (state) => ({user: state.currentUser, error: state.errorApplication.error}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
export default class App extends Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
  };

  componentWillReceiveProps(props) {
    if (props.error) {

    }

    if (!props.user.token) {
      window.location = '/getStarted.html';
    }
  }

  reloadPage() {
    window.location.reload();
  }

  renderErrorPopup() {
    return (<Modal
      isOpen={this.props.error}
      title="Unable to perform operation due to Internet connection problems or server issues."
      className={commonStyles.modal}
      >
      <WhiteFooter>
        <ActionButtonForModal
          className={commonStyles.saveButtonModal}
          onClick={::this.reloadPage}
          >
          Reload
        </ActionButtonForModal>
      </WhiteFooter>
    </Modal>);
  }

  render() {
    return (<div>
      { this.renderErrorPopup() }
      <div className={styles.topLine}>
        <div className={styles.redLine}></div>
        <div className={styles.greenLine}></div>
        <div className={styles.blueLine}></div>
        <div className={styles.yellowLine}></div>
      </div>
      <ToastManager />
      <NavBar username={this.props.user.name} logout={this.props.logoutUser} />
      <section className={styles.contenthost}>
        <SearchBar />
        <RouteHandler />
      </section>
    </div>);
  }
}
