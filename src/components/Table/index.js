import React, { Component } from 'react';
import 'font-awesome-webpack';
import { sortByOrder } from 'lodash';
import cx from 'classnames';

import Checkbox, { partiallyChecked } from 'components/Checkbox';
import { onEnterPressed } from 'common';
import styles from './index.css';

export default class Table extends Component {
  static propTypes = {
    config: React.PropTypes.object.isRequired,
    className: React.PropTypes.string,
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.any.isRequired,
    })),
    onRowClick: React.PropTypes.func,
    onSelectionChange: React.PropTypes.func,
  };

  static defaultProps = {
    onSelectionChange: () => {},
    onRowClick: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      sort: {
        by: 'name',
        order: true,
      },
    };
  }

  onSelectAllCheckboxClick() {
    this.setState({
      selection: this.state.selection.length ? [] : [...this.props.data],
    });
  }

  onColumnHeaderClick(value) {
    const order = this.state.sort.by === value ? !this.state.sort.order : true;

    this.setState({
      sort: {
        by: value,
        order: order,
      },
    });
  }

  onRowKeyDown(row, event) {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (document.activeElement !== event.target) {
      return;
    }

    if (event.which === 32) { /* SPACE */
      this.selectRow(row, null, event);

      if (event.target.nextSibling) {
        event.target.nextSibling.focus();
      }
    }

    if (event.which === 38 && event.target.previousSibling) { /* UP */
      event.target.previousSibling.focus();
    }

    if (event.which === 40 && event.target.nextSibling) { /* DOWN */
      event.target.nextSibling.focus();
    }
  }

  getHeaderCheckboxState() {
    if (this.state.selection.length === this.props.data.length) {
      return true;
    }
    return (this.state.selection.length > 0) ? partiallyChecked : false;
  }

  selectRow(row, data, event) {
    const selection = [...this.state.selection];
    const index = selection.indexOf(row);

    if (index === -1) {
      selection.push(row);
    } else {
      selection.splice(index, 1);
    }

    this.props.onSelectionChange(selection);
    this.setState({ selection });
    event.stopPropagation();
  }

  renderHeaderColumns() {
    return this.props.config.columns.map((col, index) => {
      const className = cx(
        styles.tableHeader,
        styles['column-' + index],
        col.className,
        'header'
      );

      const clickHandler = this.onColumnHeaderClick.bind(this, col.key);
      const handlers = {
        tabIndex: 0,
        onClick: clickHandler,
        onKeyPress: onEnterPressed(clickHandler),
      };

      let content = <span {...handlers}>{col.text}</span>;

      if (col.icon) {
        const pointer = {
          cursor: 'pointer',
        };
        content = (
          <i
            className={col.icon}
            style={pointer}
            {...handlers}
          >
            <div className={styles.labelRect}>
              {col.text}
              <div className={styles.labelArrow}></div>
            </div>
          </i>
        );
      }

      return (<td key={index} className={className} style={col.style}>{content}</td>);
    });
  }

  renderHeaderCheckboxColumn() {
    return (
      <td key="checkbox" className={styles.checkTd}>
        <Checkbox
          tabIndex="0"
          onChange={::this.onSelectAllCheckboxClick}
          checked={::this.getHeaderCheckboxState()}
          className="headerCheckbox"
          />
      </td>
    );
  }

  renderCheckboxColumn(row) {
    const isChecked = this.state.selection.indexOf(row) !== -1;

    return (
      <td key="checkbox">
        <Checkbox tabIndex="0" onChange={this.selectRow.bind(this, row)} checked={isChecked}/>
      </td>
    );
  }

  renderRow(rowData) {
    const dumbRenderer = (data) => data;

    return this.props.config.columns.map((col, idx) => {
      const content = (col.renderer || dumbRenderer)(rowData[col.key], rowData);

      return (<td key={idx} style={col.style} className={col.className}>{content}</td>);
    });
  }


  renderRows() {
    const orderData = () => sortByOrder(this.props.data, [(item) => {
      if (this.state.sort.by === 'date') {
        return new Date(item[this.state.sort.by]);
      }
      if (typeof item[this.state.sort.by] !== 'string') {
        return item[this.state.sort.by];
      }
      return item[this.state.sort.by].toLowerCase();
    }], this.state.sort.order);

    const rows = orderData();

    return rows.map((rowData) => {
      const row = this.renderRow(rowData);
      const onRowClick = this.props.onRowClick.bind(this, rowData);

      if (this.props.config.selectable) {
        row.unshift(this.renderCheckboxColumn(rowData));
      }

      return (
        <tr
          key={rowData.id}
          tabIndex="0"
          className={styles.tableBodyRow}
          onClick={onRowClick}
          onKeyDown={this.onRowKeyDown.bind(this, rowData)}
          onKeyPress={onEnterPressed(onRowClick)}
        >
          {row}
        </tr>);
    });
  }

  render() {
    let headerCheckboxColumn = null;
    if (this.props.config.selectable) {
      headerCheckboxColumn = this.renderHeaderCheckboxColumn();
    }

    const headerColumns = this.renderHeaderColumns();

    return (
      <table className={cx(styles.table, this.props.className)}>
        <thead className={styles.tableHeader}>
          <tr key="header">{[headerCheckboxColumn, ...headerColumns]}</tr>
        </thead>

        <tbody className={styles.tableBody}>
          { this.renderRows() }
        </tbody>
      </table>
    );
  }
}
