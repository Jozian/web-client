import React, { Component } from 'react/addons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './style.css';
import ActionButton from 'components/ActionButton';
import * as actions from 'actions/motd.js';
import loading from 'decorators/loading';

@connect(
  (state) => ({motd: state.motd, pendingActions: state.pendingActions}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
@loading(
  (state) => state.motd.loading,
  { isLoadingByDefault: true }
)
export default class StatisticsPage extends Component {
  static propTypes = {
    motd: React.PropTypes.object,
    pendingActions: React.PropTypes.object,
    updateMOTD: React.PropTypes.func.isRequired,
    loadMOTD: React.PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);

    props.loadMOTD();
    this.state = {
      motd: '',
    };
  }

  clickHandler() {
    const value = React.findDOMNode(this.refs.motd).value;

    if (!value || value.length > 230) {
      return;
    }

    this.props.updateMOTD(value).then(() => {
      this.setState({
        motd: '',
      });
    });
  }

  render() {
    const isButtonDisabled = (
      !this.state.motd
      || this.state.motd.length > 230
    );


    return (
      <div>
        <h1>Message of the day</h1>
        <div className={styles.motd}>
          <div className={styles.fieldWrapper}>
            <label className={styles.label}>Current:</label>
            <div className={styles.currentValue}>{this.props.motd.entity.text || '(empty)'}</div>
          </div>

          <div className={styles.fieldWrapper}>
            <label className={styles.label}>New:</label>
            <textarea value={this.state.motd}
                      ref="motd"
                      autoFocus
                      onChange={ (e) => { this.setState({ motd: e.target.value }); }}
                      placeholder="max. 230 characters"
                      className={styles.textArea}>
            </textarea>
          </div>

          <div className={styles.fieldWrapper}>
            <div className={styles.buttonWrapper}>
              <ActionButton
                icon="fa fa-pencil"
                inProgress={this.props.pendingActions.updateMotd}
                disabled={isButtonDisabled}
                onClick={::this.clickHandler}
              >
                Update
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
