import React, { Component } from 'react';
import { RouteHandler } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions/users';
import * as appActions from '../../actions/app';
import Modal from 'components/Modal';
import NavBar from 'components/NavBar';
import ToastManager from '../ToastManager';
import WhiteFooter from 'components/WhiteFooter';
import ActionButtonForModal from 'components/ActionButtonForModal';

import styles from './index.css';
import commonStyles from 'common/styles.css';

@connect(
  (state) => ({user: state.currentUser, error: state.errorApplication.error, clientError: state.clientError}),
  (dispatch) => bindActionCreators(Object.assign({}, actions, appActions), dispatch)
)
export default class App extends Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      openClientError: false,
      errorClientText: '',
    };
  }

  componentWillReceiveProps(props) {
    if (!props.user.token) {
      window.location = '/index.html';
    }

    if (props.clientError.hasError && props.clientError.errorStatus === 403 && props.clientError.errorMsg === 'Access denied') {
      props.logoutUser();
    } else if (props.clientError.hasError && props.clientError.errorStatus === 404) {
      this.setState({
        openClientError: true,
        errorClientText: 'The server was not able to find the data you have provided. Perhaps this particular data is outdated. After you press the button below, you can continue working with the application.',
      });
    } else if (props.clientError.hasError && props.clientError.errorStatus === 400) {
      this.setState({
        openClientError: true,
        errorClientText: 'The server was not able to process the data you have provided. After you click the button below, you an try again with different data.',
      });
    }
  }

  reloadPage() {
    window.location.reload();
  }

  hideClientPopup() {
    this.setState({
      openClientError: false,
    });

    this.props.hideClientError();
  }

  renderClientErrorPopup() {
    return (<Modal
      isOpen={this.state.openClientError}
      title="Client error."
      className={commonStyles.modal}
      >
      <div className={styles.popupText}>{this.state.errorClientText}</div>
      <WhiteFooter>
        <ActionButtonForModal
          className={commonStyles.saveButtonModal}
          onClick={::this.hideClientPopup}
          >
          Hide
        </ActionButtonForModal>
      </WhiteFooter>
    </Modal>);
  }

  renderErrorPopup() {
    return (<Modal
      isOpen={this.props.error}
      title="Server error."
      className={commonStyles.modal}
      >
      <div className={styles.popupText}>Unable to perform operation due to Internet connection problems or server issues. In case 'Refresh' button does not help, try logging out.</div>
      <WhiteFooter>
        <ActionButtonForModal
          className={commonStyles.saveButtonModal}
          onClick={::this.reloadPage}
          >
          Reload
        </ActionButtonForModal>
        <ActionButtonForModal
          className={commonStyles.cancelButtonModal}
          onClick={this.props.logoutUser}
          >
          Logging out
        </ActionButtonForModal>
      </WhiteFooter>
    </Modal>);
  }

  render() {
    return (<div>
      { this.renderErrorPopup() }
      { this.renderClientErrorPopup() }

      <ToastManager />

      <NavBar userType={this.props.user.type} username={this.props.user.name} logout={this.props.logoutUser} />
      <section className={styles.contenthost}>
        <div className={styles.topLine}>
          <div className={styles.redLine}></div>
          <div className={styles.greenLine}></div>
          <div className={styles.blueLine}></div>
          <div className={styles.yellowLine}></div>
        </div>

        <RouteHandler />
      </section>
    </div>);
  }
}
