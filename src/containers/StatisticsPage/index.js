import React, { Component } from 'react/addons';
import ReactWinJS from 'react-winjs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import style from './style.css';
import * as actions from '../../actions/statistics.js';
import Button from '../../components/Button';
import PreviewImage from '../../components/PreviewImage';
import PageFooter from '../../components/PageFooter';
import LoadingSpinner from '../../components/LoadingSpinner';

@connect(
  (state) => ({statistics: state.statistics}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
export default class StatisticsPage extends Component {
  static propTypes = {
    statistics: React.PropTypes.object.isRequired,
    addToExport: React.PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);

    props.loadStatistics();
    this.state = { loading: true };
  }

  componentWillMount() {
    const stats = this.props.statistics;
    if (!stats.loading && !stats.error) {
      this.setState({
        topDownloads: new WinJS.Binding.List(stats.entities.top5Downloads),
        topViews: new WinJS.Binding.List(stats.entities.top5Views),
      });
    }
  }

  componentWillUpdate(props) {
    if (this.props === props) {
      return;
    }

    const stats = props.statistics;
    this.setState({ loading: stats.loading});
    if (!stats.loading && !stats.error) {
      this.setState({
        topDownloads: new WinJS.Binding.List(stats.entities.top5Downloads),
        topViews: new WinJS.Binding.List(stats.entities.top5Views),
      });
    }
  }

  boundCSSTransitionGroup() {
    return function wrapper(props, ...rest) {
      return React.createFactory(React.addons.CSSTransitionGroup)(
        {
          transitionName: 'loader',
          component: 'div',
          ...props,
        },
        ...rest
      );
    };
  }

  listViewItemRenderer = ReactWinJS.reactRenderer((item) => {
    // FIXME:
    return (
      <div className={style.listItem}>
        <div className={style.number}>
          {item.data.number}
        </div>
        <PreviewImage
          className={style.image}
          src={'http://www.microsofteducationdelivery.net' + item.data.picture}
        />
        <div className={style.name}>{item.data.text}</div>
      </div>);
  })

  render() {
    return (
      <div>
        <h1>Statistics</h1>

        <LoadingSpinner loading={this.state.loading}>

          <div className={style.listContainer}>
            <div className={style.toolbar} id="downloaded">
              <span className={style.toolbarTitle}>most downloaded media</span>
            </div>
            <ReactWinJS.ListView
              className={style.container}
              itemDataSource={this.state.topViews.dataSource}
              itemTemplate={this.listViewItemRenderer}
              layout={ {type: WinJS.UI.ListLayout} } />

          </div>
          <div className={style.listContainer}>
            <div className={style.toolbar} id="downloaded">
              <span className={style.toolbarTitle}>most viewed media</span>
            </div>

            <ReactWinJS.ListView
              className={style.container}
              itemDataSource={this.state.topDownloads.dataSource}
              itemTemplate={this.listViewItemRenderer}
              layout={ {type: WinJS.UI.ListLayout} } />
          </div>
          <PageFooter>
              <Button onClick={() => {this.props.addToExport(); }} text="Export" />
          </PageFooter>
        </LoadingSpinner>
      </div>);
  }
}
