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
  (state) => ({user: state.currentUser, clientError: state.clientError}),
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
      window.location = '/';
    }

    if (props.clientError.hasError && props.clientError.errorStatus === 403 && props.clientError.errorMsg === 'Access denied') {
      props.logoutUser();
    } else if (props.clientError.hasError && props.clientError.errorStatus === 404) {
      this.setState({
        openClientError: true,
        errorClientText: 'The server was not able to find the data you have provided. Perhaps this particular data is outdated. After you press the button below, you can continue working with the application.',
      });
    } else if (props.clientError.hasError && props.clientError.errorStatus === 400 && props.clientError.errorMsg === 'It is not current type') {
      this.setState({
        openClientError: true,
        errorClientText: 'It is not correct type for media file. Please, close this popup and choose new file.',
      });
    } else if (props.clientError.hasError && props.clientError.errorStatus === 400) {
      this.setState({
        openClientError: true,
        errorClientText: 'The server was not able to process the data you have provided. After you click the button below, you an try again with different data.',
      });
    } else if (props.clientError.hasError && props.clientError.errorStatus >= 500) {
      this.setState({
        openServerError: true,
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
      isOpen={this.state.openServerError}
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
    const urlMenu = `${window.location.origin}/index.html`;
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
        <footer className={styles.footer}>
          <div className={styles.copyright}>
            &#169;  2016 Microsoft Corporation. All rights reserved.
          </div>
          <div className={styles.bottomMenu}>
              <a className={styles.footerLink} href="/#getStarted">Get Started</a>
              <a className={styles.footerLink} href="/#useCases">Use Cases</a>
              <a className={styles.footerLink} href="/#openSource">Open Source</a>
              <a className={styles.footerLink} href="/#support">Support</a>
              <a className={styles.footerLink} href="http://go.microsoft.com/fwlink/?LinkID=206977">Terms of Use</a>
              <a className={styles.footerLink} href="http://go.microsoft.com/fwlink/?LinkId=521839">Privacy & Cookies</a>
          </div>
        </footer>
      </section>
    </div>);
  }
}
