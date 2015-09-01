import React, { Component } from 'react/addons';
import ImageLoader from 'react-imageloader';

import style from './style.css';

export default class PreviewImage extends Component {
  static propTypes = {
    src: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    imgClassName: React.PropTypes.string,
  }

  renderWrapper(props, ...rest) {
    return React.createFactory(React.addons.CSSTransitionGroup)(
      {
        transitionName: 'loader',
        component: 'div',
        ...props,
      },
      ...rest
    );
  }

  render() {
    return (
      <div className={this.props.className}>
        <ImageLoader
          src={this.props.src}
          wrapper={this.renderWrapper}
          style={{position: 'relative', width: '100%', height: '100%'}}
          preloader={() => (<div key="preload" className={style.imageLoader}>
            <div className={style.throbber} />
          </div>)}
          imgProps={{
            style: {width: '100%', height: '100%'},
            className: this.props.imgClassName,
          }}
        />
      </div>
    );
  }
}
