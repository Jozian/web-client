import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ListView, reactRenderer as winjsReactRenderer } from 'react-winjs';
import { Link } from 'react-router';


import winjsBind from '../../decorators/winjsBind';
import { loadFoldersList } from '../../actions/folders';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import PreviewImage from '../../components/PreviewImage';
import LoadingSpinner from '../../components/LoadingSpinner';
import Footer from '../../components/Footer';
import styles from './index.css';
import common from '../../common/styles.css';


@connect(
  (state) => ({folder: state.activeFolder}),
  (dispatch) => bindActionCreators({ loadFoldersList }, dispatch)
)
@winjsBind(
  (props) => ({
    items: props.folder.entity.data,
  })
)
export default class FolderPage extends Component {
  static propTypes = {
    folder: React.PropTypes.object.isRequired,
    params: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
    }),
    items: React.PropTypes.shape({
      dataSource: React.PropTypes.object.isRequired,
    }),
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    props.loadFoldersList(props.params.id);
    this.state = { loading: true };
  }

  componentWillReceiveProps(props) {
    this.setState({ loading: props.folder.loading});
    if (props.params.id !== this.props.params.id) {
      props.loadFoldersList(props.params.id);
      this.setState({loading: true});
    }
  }

  listViewItemRenderer = winjsReactRenderer((item) => {
    // FIXME:
    return (
      <div className={styles.listItem}>
        <PreviewImage
          className={styles.image }
          src={'http://www.microsofteducationdelivery.net' + item.data.picture}
        />
        <div className={styles.name}>{item.data.name}</div>
      </div>
    );
  })

  handleItemSelected(event) {
    event.detail.itemPromise.then((item) => {
      this.context.router.transitionTo('folder', {id: item.data.id.toString() });
    });
  }

  renderBreadcrumbs() {
    return (<ul className={styles.breadcrumbs}>
      <li><Link to="libraries">Libraries</Link></li>
      {
        (this.props.folder.entity.path || []).map((pathEntry) =>
          (<li>
            <Link to="folder" params={{id: pathEntry.id}}>
              {pathEntry.title}
            </Link>
          </li>)
        )
      }
    </ul>);
  }

  render() {
    return (
      <LoadingSpinner loading={this.state.loading}>
        <h1>{this.props.folder.entity.name}
        <IconButton
          className={common.headerButton}
          icon="fa fa-file-o"
          tooltipText="Add new media"
        />
        <IconButton
          className={common.headerButton}
          icon="fa fa-folder-open"
          tooltipText="Add new folder"
        />
      </h1>
      { this.renderBreadcrumbs() }
      <div className={styles.column} style={{backgroundColor: '#f6f6f6'}}>
        <ListView
          className={styles.list}
          itemDataSource={this.props.items.dataSource}
          itemTemplate={this.listViewItemRenderer}
          onItemInvoked={::this.handleItemSelected}
          layout={ {type: WinJS.UI.ListLayout} }
        />
        <Footer />
      </div>
      <div className={styles.column} style={{backgroundColor: 'blue'}}>
        <Footer>
          <Button icon="fa fa-save">Save</Button>
        </Footer>
      </div>
    </LoadingSpinner>);
  }
}
// itemTemplate={this.listViewItemRenderer}
// layout={ {type: WinJS.UI.ListLayout} }
