import 'babel-core/polyfill';
import React, { Component } from 'react/addons';
import { ListView, reactRenderer as winjsReactRenderer } from 'react-winjs';
import { connect } from 'react-redux';
import winjsBind from '../../decorators/winjsBind';
import { bindActionCreators } from 'redux';

import style from './style.css';
import * as actions from '../../actions/statistics.js';
import Button from '../../components/Button';
import PreviewImage from '../../components/PreviewImage';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';

@connect(
  (state) => ({statistics: state.statistics}),
  (dispatch) => bindActionCreators(actions, dispatch)
)
@winjsBind(
  (props) => ({
    topDownloads: props.statistics.entities.top5Downloads,
    topViews: props.statistics.entities.top5Views,
  })
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
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    props.loadStatistics();
    this.state = { loading: true };
  }

  componentWillReceiveProps(props) {
    this.setState({ loading: props.statistics.loading});
  }

  async handleItemSelected(event) {
    const item = await event.detail.itemPromise;
    this.context.router.transitionTo('folderSelection', {
      folderId: item.data.folder.toString(),
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
          <div style={{height: '100%'}}>
          <div className={style.listContainer}>
            <div className={style.toolbar} id="downloaded">
              <span className={style.toolbarTitle}>most downloaded media</span>
            </div>
            <ListView
              className={style.container}
              itemDataSource={this.props.topViews.dataSource}
              itemTemplate={this.listViewItemRenderer}
              onItemInvoked={::this.handleItemSelected}
              layout={ {type: WinJS.UI.ListLayout} }
            />
          </div>
          <div className={style.listContainer}>
            <div className={style.toolbar} id="downloaded">
              <span className={style.toolbarTitle}>most viewed media</span>
            </div>

            <ListView
              className={style.container}
              itemDataSource={this.props.topDownloads.dataSource}
              itemTemplate={this.listViewItemRenderer}
              onItemInvoked={::this.handleItemSelected}
              layout={ {type: WinJS.UI.ListLayout} }
            />
          </div>
          <Footer>
              <Button onClick={::this.props.addToExport}>Export</Button>
          </Footer>
          </div>
        </LoadingSpinner>
      </div>);
  }
}
