import 'babel-core/polyfill';
import React, { Component } from 'react/addons';
import { ListView, reactRenderer as winjsReactRenderer } from 'react-winjs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import cx from 'classnames';

import * as actions from 'actions/statistics.js';
import Header from 'components/Header';
import ActionButton from 'components/ActionButton';
import PreviewImage from 'components/PreviewImage';
import Footer from 'components/Footer';
import { listLayout } from 'common';
import loading from 'decorators/loading';
import winjsBind from 'decorators/winjsBind';

import style from './style.css';

@connect(
  (state) => ({statistics: state.statistics, pendingActions: state.pendingActions}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
@winjsBind(
  (props) => ({
    topDownloads: props.statistics.entities.top5Downloads,
    topViews: props.statistics.entities.top5Views,
  })
)
@loading(
  (props) => props.statistics.loading,
  { isLoadingByDefault: true },
)
export default class StatisticsPage extends Component {
  static propTypes = {
    addToExport: React.PropTypes.func.isRequired,
    topViews: React.PropTypes.shape({
      dataSource: React.PropTypes.object.isRequired,
    }),
    topDownloads: React.PropTypes.shape({
      dataSource: React.PropTypes.object.isRequired,
    }),
    pendingActions: React.PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    props.loadStatistics();
  }

  async handleItemSelected(event) {
    const item = await event.detail.itemPromise;
    this.context.router.transitionTo('folderSelection', {
      folderId: item.data.folder.toString(),
      itemType: 'media',
      itemId: item.data.id.toString(),
    });
  }

  listViewItemRenderer = winjsReactRenderer((item) => {
    return (
      <div className={style.listItem}>
        <div className={style.number}>
          {item.data.number}
        </div>
        <PreviewImage
          className={style.image}
          src={item.data.picture}
          />
        <div className={style.name}>{item.data.text}</div>
      </div>);
  });

  render() {
    const mostViewedClass = cx({
      [style.container]: true,
      [style.hiddenList]: !this.props.topViews.length,
    });

    const mostDownloadedClass = cx({
      [style.container]: true,
      [style.hiddenList]: !this.props.topDownloads.length,
    });
    return (
      <div>
        <Header>Statistics</Header>
        <div style={{height: '100%'}}>
          <div className={style.listContainer}>
            <div className={style.toolbar} id="viewed">
              <span className={style.toolbarTitle}>Most downloaded media</span>
            </div>

            {this.props.topViews.length ? '' : <div className={style.noDataText}>No data to display</div> }
            <ListView
              className={mostViewedClass}
              itemDataSource={this.props.topViews.dataSource}
              itemTemplate={this.listViewItemRenderer}
              onItemInvoked={::this.handleItemSelected}
              layout={listLayout}
              />
          </div>
          <div className={style.listContainer}>
            <div className={style.toolbar} id="downloaded">
              <span className={style.toolbarTitle}>Most viewed media</span>
            </div>

            {this.props.topDownloads.length ? '' : <div className={style.noDataText}>No data to display</div> }
            <ListView
              className={mostDownloadedClass}
              itemDataSource={this.props.topDownloads.dataSource}
              itemTemplate={this.listViewItemRenderer}
              onItemInvoked={::this.handleItemSelected}
              layout={listLayout}
              />
          </div>
          <Footer>
            <ActionButton
              icon="mdl2-download"
              disabled={!this.props.topDownloads.length && !this.props.topViews.length}
              inProgress={this.props.pendingActions.statisticsExport}
              onClick={this.props.addToExport}
              tooltipText="Export statistics"
              >
            </ActionButton>
          </Footer>
        </div>
      </div>
    );
  }
}