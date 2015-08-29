import React, { Component } from 'react';
import styles from './style.css';
import fontAwesome from 'font-awesome-webpack'; // eslint-disable-line no-unused-vars
import classNames from 'classnames';

export default class IconButton extends Component {

  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    tooltipText: React.PropTypes.string,
    handleClick: React.PropTypes.func,
    className: React.PropTypes.string,
  }


  constructor(props) {
    super(props);
    this.state = {
      isTooltipVisible: false,
    };
  }

  showTooltip() {
    this.setState({
      isTooltipVisible: true,
    });
  }

  hideTooltip() {
    this.setState({
      isTooltipVisible: false,
    });
  }

  render() {
    let tooltip;
    if (this.state.isTooltipVisible && this.props.tooltipText) {
      tooltip = (<div className={styles.tooltip}>
        <div className={styles.tooltipInner}>{this.props.tooltipText}</div>
      </div>);
    }

    const cls = classNames(styles.iconButton, this.props.className);

    return (
      <div onMouseEnter={::this.showTooltip} onMouseLeave={::this.hideTooltip} className={cls}>
        <button onClick={this.props.handleClick} className={styles.btn}>
          <i className={this.props.icon}></i>
        </button>
        { tooltip }
      </div>
    );
  }
}
