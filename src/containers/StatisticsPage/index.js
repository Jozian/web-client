import React, { Component } from 'react';
import ReactWinJS from 'react-winjs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import style from './style.css';
import * as actions from '../../actions/statistics.js';
import Button from '../../components/Button';
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

    if (!stats.loading && !stats.error) {
      this.setState({
        topDownloads: new WinJS.Binding.List(stats.entities.top5Downloads),
        topViews: new WinJS.Binding.List(stats.entities.top5Views),
      });
    }
  }

  listViewItemRenderer = ReactWinJS.reactRenderer((item) => {
    // FIXME:
    return (
      <div className={style.listItem}>
        <div className={style.number}>
          <h4> {item.data.number} </h4>
        </div>
        <img src={'http://www.microsofteducationdelivery.net' + item.data.picture} className={style.image} />
        <div className={style.name}>
          <h6> {item.data.text} </h6>
        </div>
      </div>);
  })

  render() {
    return (
      <div>
        <h1 className={style.pageTittle}>Statistics</h1>

        <LoadingSpinner loading={this.props.statistics.loading}>

          <div className={style.listContainer}>
            <div className={style.toolbar} id="downloaded">
              <span className={style.toolbarTittle}>most downloaded media</span>
            </div>
            <ReactWinJS.ListView
              className={style.container}
              itemDataSource={this.state.topViews.dataSource}
              itemTemplate={this.listViewItemRenderer}
              layout={ {type: WinJS.UI.ListLayout} } />

          </div>
          <div className={style.listContainer}>
            <div className={style.toolbar} id="downloaded">
              <span className={style.toolbarTittle}>most viewed media</span>
            </div>

            <ReactWinJS.ListView
              className={style.container}
              itemDataSource={this.state.topDownloads.dataSource}
              itemTemplate={this.listViewItemRenderer}
              layout={ {type: WinJS.UI.ListLayout} } />
          </div>
          <footer className="pageFooter">
            <div className="footerWrapper">
              <Button onClick={() => {this.props.addToExport(); }} text="Export" />
            </div>
          </footer>
        </LoadingSpinner>
      </div>);
  }
}
