import React, { Component } from 'react';
import 'font-awesome-webpack';
import classNames from 'classnames';

import styles from './style.css';

export default class IconButton extends Component {

  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    tooltipText: React.PropTypes.string,
    onClick: React.PropTypes.func,
    className: React.PropTypes.string,
  };


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
      <div
        onMouseEnter={::this.showTooltip}
        onMouseLeave={::this.hideTooltip}
        className={cls}
      >
        <button
          onClick={this.props.onClick}
          onFocus={::this.showTooltip}
          onBlur={::this.hideTooltip}
          className={styles.btn}
        >
          <span className={styles.hiddenSpan}>{this.props.tooltipText}</span>
          <i className={this.props.icon}></i>

        </button>
        { tooltip }
      </div>
    );
  }
}
