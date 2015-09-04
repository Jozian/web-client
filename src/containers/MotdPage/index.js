import React, { Component } from 'react/addons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from './style.css';
import Button from 'components/Button';
import * as actions from 'actions/motd.js';
import loading from 'decorators/loading';

@connect(
  (state) => ({motd: state.motd}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
@loading(
  (state) => state.motd.loading,
  { isLoadingByDefault: true }
)
export default class StatisticsPage extends Component {
  static propTypes = {
    motd: React.PropTypes.object,
    updateMOTD: React.PropTypes.func.isRequired,
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

    this.props.updateMOTD(value);
    this.setState({
      motd: '',
    });
  }
  render() {
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
                      onChange={ (e) => { this.setState({ motd: e.target.value }); }}
                      placeholder="max. 230 characters"
                      className={styles.textArea}>
            </textarea>
          </div>

          <div className={styles.fieldWrapper}>
            <div className={styles.buttonWrapper}>
              <Button disabled={!this.state.motd || this.state.motd.length > 230}
                      onClick={::this.clickHandler}>
                Update </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
