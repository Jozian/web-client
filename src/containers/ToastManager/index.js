import React, { Component } from 'react/addons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactToastr, { ToastContainer } from 'react-toastr';

import 'style!css!toastr/build/toastr.css';
import 'style!css!animate.css/animate.css';

import { removePendingToast } from 'actions/toasts';

const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

@connect(
  (state) => ({ toasts: state.pendingToasts }),
  (dispatch) => bindActionCreators({ removePendingToast }, dispatch)
)
export default class ToastManager extends Component {
  static propTypes = {
    pendingToasts: React.PropTypes.arrayOf(React.PropTypes.shape({
      title: React.PropTypes.string.required,
      text: React.PropTypes.string.required,
    })),
    removePendingToast: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const newProps = this.props;
    newProps.toasts.forEach((toast) => {
      this.refs.container[toast.type](
        toast.title,
        toast.text,
        {
          timeOut: 5000,
          extendedTimeOut: 1000,
        }
      );
      this.props.removePendingToast(toast);
    });
  }

  render() {
    return (
      <div>
        <ToastContainer ref="container"
          toastMessageFactory={ToastMessageFactory}
          className="toast-top-right"
        />
      </div>
    );
  }

}
