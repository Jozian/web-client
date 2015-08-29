import React, { Component } from 'react';
import styles from './style.css';

class MotdPage extends Component {
    static propTypes = {
        text: React.PropTypes.string,
        handleClick: React.PropTypes.func,
        handleKeyUp: React.PropTypes.func,
        disableButton: React.PropTypes.bool,
        disableError: React.PropTypes.bool
    }

    constructor(props) {
        super(props);
        this.state = {
            oldText: this.props.data['text'],
            textLength: this.props.data['textLength'],
            disableButton: true,
            disableError: false
        };
    }

    handleClick(e) {
        e.preventDefault();
        this.setState({
            oldText: React.findDOMNode(this.refs.newState).value
        });
        //alert(React.findDOMNode(this.refs.newState).value);
    }

    handleKeyUp(e) {
        let l = e.target.value.length;
        if ((l > 0)&&(l <= this.state.textLength )){
            this.setState({
                disableButton: false
            });
        }else{
            this.setState({
                disableButton: true
            });
        }
        if (l > this.state.textLength ){
            this.setState({
                disableError: true
            });
        }else{
            this.setState({
                disableError: false
            });
        }
    }

    render(){
        const errorMsg = this.state.disableError ? 'block' : 'none';

        return (
            <div className={styles.motd}>
                <div className={styles.fieldWrapper}>
                    <label className={styles.label}>Current:</label>
                    <div className={styles.currentValue}>{this.state.oldText}</div>
                </div>
                <div className={styles.fieldWrapper}>
                    <label className={styles.label}>New:</label>
                    <textarea ref="newState" onKeyUp = {::this.handleKeyUp}  placeholder={'max. '+this.props.data['textLength']+' characters'} className={styles.newValue+' '+styles.textarea}></textarea>
                    <div style={{display:errorMsg}} className={styles.error}>? Error: max length {this.props.data.textLength}</div>
                </div>
                <div className={styles.fieldWrapper}>
                    <button disabled={this.state.disableButton} onClick = {::this.handleClick} className={styles.button}>UPDATE</button>
                </div>
            </div>
        );
    }
}

export default MotdPage;