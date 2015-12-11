import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import * as actions from 'actions/comments';
import Header from 'components/Header';
import Table from 'components/Table';
import DocumentTitle from 'components/DocumentTitle';
import Footer from 'components/Footer';
import IconButton from 'components/IconButton';
import ActionButton from 'components/ActionButton';
import { renderDate } from 'components/Table/renderers';
import loading from 'decorators/loading';

import commonStyles from 'common/styles.css';
import styles from './index.css';

function renderIcon(type) {
  switch (type) {
  case 'video':
    return <i className="fa fa-file-video-o" />;
  case 'image':
    return <i className="fa fa-file-image-o" />;
  default:
    return <i className="fa fa-file-o" />;
  }
}

@connect(
  (state) => ({ media: state.media, pendingActions: state.pendingActions }),
  (dispatch) => bindActionCreators(actions, dispatch)
)
@loading(
  (state) => state.media.loading,
  { isLoadingByDefault: true },
)
export default class CommentsPage extends Component {

  static propTypes = {
    media: React.PropTypes.array.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    props.loadMediaList();
  }

  onRowClick(value) {
    this.context.router.transitionTo('comment', {
      mediaName: value.name.toString(),
      id: value.id.toString(),
    });
  }

  onJumpButtonClick(rowData, e) {
    e.stopPropagation();
    if (!rowData.FolderId) {
      rowData.FolderId = 'library' + rowData.LibraryId;
    }
    this.context.router.transitionTo('mediaSelection', {
      folderId: rowData.FolderId.toString(),
      itemType: 'media',
      itemId: rowData.id.toString(),
    });
  }

  config = {
    columns: [
      {
        key: 'type',
        text: 'Type',
        className: styles.typeCell,
        renderer: renderIcon,
      },
      {
        key: 'name',
        text: 'Name',
        className: styles.nameCell,
      },
      {
        key: 'button',
        renderer: ::this.renderJumpButton,
        className: styles.buttonCell,
      },
      {
        key: 'path',
        text: 'Library',
        className: styles.libraryCell,
      },
      {
        key: 'like',
        text: 'Likes',
        className: commonStyles.numberCell,
      },
      {
        key: 'unlike',
        text: 'Dislikes',
        className: commonStyles.numberCell,
      },

      {
        key: 'date',
        text: 'Date',
        renderer: renderDate,
        className: styles.dateCell,
      },
      {
        key: 'amount',
        text: 'Amount',
        className: commonStyles.numberCell,
      },
    ],
    selectable: false,
  };

  renderJumpButton(_, rowData) {
    return (<IconButton
      className={styles.rowButton}
      icon="fa fa-search"
      onClick={this.onJumpButtonClick.bind(this, rowData)}
      tooltipText={`Show library ${rowData.name}`}
    />);
  }

  render() {
    return (
      <div>
        <DocumentTitle title="Commentaries" />
        <Header>Commentaries</Header>
        {this.props.media.entities.length ? <Table
          overlayClassName={commonStyles.tableOverlay}
          className={cx(commonStyles.table, styles.table)}
          config={this.config}
          data={this.props.media.entities}
          onRowClick={::this.onRowClick}
          /> : <div className={styles.noComments}>No commentaries yet.</div>}

        <Footer>
            <ActionButton
              icon="mdl2-download"
              disabled={!this.props.media.entities.length}
              inProgress={this.props.pendingActions.commentsExport}
              onClick={this.props.exportComments}
              tooltipText="Export commentaries"
            >
            </ActionButton>
        </Footer>
      </div>
    );
  }
}
