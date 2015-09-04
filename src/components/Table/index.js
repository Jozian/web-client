import React, { Component } from 'react';
import 'font-awesome-webpack';
import { sortByOrder } from 'lodash';
import cx from 'classnames';

import Checkbox, { partiallyChecked } from 'components/Checkbox';
import styles from './index.css';

class Table extends Component {
  static propTypes = {
    config: React.PropTypes.object.isRequired,
    className: React.PropTypes.string,
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.any.isRequired,
    })),
    onRowClick: React.PropTypes.func,
  };

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

  _onRowClick(rowData) {
    this.props.onRowClick(rowData);
  }

  _generateCheckBoxCol(row) {
    const isChecked = this.state.selection.indexOf(row) !== -1;

    return (
      <td>
         <Checkbox onChange={this.handleCheck.bind(this, row)} checked={isChecked}/>
      </td>
    );
  }

  _generateHeaderColumns() {
    return this.props.config.columns.map((col, index) => {
      const className = cx(styles.tableHeader, styles['column-' + index]);
      let icon = '';

      if (col.text) {
        const pointer = {
          cursor: 'pointer',
        };
        icon = (
          <i className={col.icon} style={pointer} onClick={this._reorder.bind(this, col.key)}>
            <div className={styles.labelRect}>
              {col.text}
              <div className={styles.labelArrow}></div>
            </div>
          </i>
        );
      }

      return (<td className={className} style={col.styles}> {icon} </td>);
    });
  }


  _generateTableCel(rowData) {
    const dumbRenderer = (data) => data;

    return this.props.config.columns.map((col) => {
      const content = (col.renderer || dumbRenderer)(rowData[col.key]);

      return (<td key={col.key} style={col.styles} onClick={this.props.onRowClick.bind(this, rowData)}>{content}</td>);
    });
  }

  selectAll() {
    if (this.state.selection.length) {
      this.setState({
        selection: [],
      });
    } else {
      this.setState({
        selection: [...this.props.data],
      });
    }
  }

  handleCheck(row) {
    const selection = [...this.state.selection];
    const index = selection.indexOf(row);

    if (index === -1) {
      selection.push(row);
    } else {
      selection.splice(index, 1);
    }

    this.setState({ selection });
  }

  _reorder(value) {
    const order = this.state.sort.by === value ? !this.state.sort.order : true;

    this.setState({
      sort: {
        by: value,
        order: order,
      },
    });
  }

  _orderData() {
    return sortByOrder(this.props.data, [(item) => {
      if (this.state.sort.by === 'date') {
        return new Date(item[this.state.sort.by]);
      }
      if (typeof item[this.state.sort.by] !== 'string') {
        return item[this.state.sort.by];
      }
      return item[this.state.sort.by].toLowerCase();
    }], this.state.sort.order);
  }

  renderRows() {
    const rowData = this._orderData();

    return rowData.map((data) => {
      const td = this._generateTableCel(data);

      if (this.props.config.selectable) {
        td.unshift(this._generateCheckBoxCol(data));
      }

      return (<tr key={data.id} className={styles.tableBodyRow}>{td}</tr>);
    });
  }

  getHeaderCheckboxState() {
    if (this.state.selection.length === this.props.data.length) {
      return true;
    }
    return (this.state.selection.length > 0) ? partiallyChecked : false;
  }

  renderHeaderCheckboxColumn() {
    return (
      <td className={styles.checkTd}>
        <Checkbox
          onChange={::this.selectAll}
          checked={::this.getHeaderCheckboxState()}
          className="headerCheckbox"
        />
      </td>
    );
  }

  render() {
    let headerCheckboxColumn = null;
    if (this.props.config.selectable) {
      headerCheckboxColumn = this.renderHeaderCheckboxColumn();
    }

    const headerColumns = this._generateHeaderColumns();

    return (
      <table className={cx(styles.table, this.props.className)}>
        <thead className={styles.tableHeader}>
          <tr>{[headerCheckboxColumn, ...headerColumns]}</tr>
        </thead>

        <tbody className={styles.tableBody}>
        { this.renderRows() }
        </tbody>
      </table>
    );
  }
}

export default Table;
