import React, { Component } from 'react';
import styles from './style.css';
import fontAwesome from 'font-awesome-webpack';

class IconButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  show(){
    this.setState({
      isVisible: true,
    })
  }

  hide(){
    this.setState({
      isVisible: false,
    })
  }

  render() {

    let tooltip;
    if (this.state.isVisible){
      tooltip = <div className={styles.tooltip}><div className={styles.tooltip-inner}>{this.props.tooltipText}</div>
    }

    return (
      <div onMouseEnter={::this.show} onMouseLeave={::this.hide} className={styles.iconButton}>
        <button onClick={this.props.handleClick} className={styles.btn}>
          <i className={this.props.icon}></i>
        </button>
        { tooltip }
      </div>
    );
  }
}

IconButton.propTypes = {
  icon: React.PropTypes.string,
  tooltipText: React.PropTypes.string,
  handleClick: React.PropTypes.func,
};

export default IconButton;