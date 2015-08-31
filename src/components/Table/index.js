import React, { Component } from 'react';
import classNames from 'classnames';
import 'font-awesome-webpack';
import {pluck, sortByOrder} from 'lodash';
import cx from 'classnames';

import Checkbox from '../Checkbox';
import styles from './index.css';

class Table extends Component {
  static propTypes = {
    config: React.PropTypes.object.isRequired,
    className: React.PropTypes.string,
    data: React.PropTypes.array.isRequired,
    onRowClick: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      isAllSelected: false,
      partialChecked: false,
      selected: [],
      sort: {
        by: 'name',
        order: true,
      },
    };
  }

  getChecked() {
    return this.state.selected;
  }

  _onRowClick(rowData, event) {
    let target = event.target;
    while (target) {
      if (target.className.indexOf('b_table-button') !== -1) {
        return;
      }
      target = target.parentElement;
    }

    this.props.onRowClick(rowData);
  }

  _generateHeaderCheckBoxCol() {
    return (
      <td className={styles.checkTd}>
        <Checkbox onChange={::this._selectAll} partialChecked={this.state.partialChecked} isChecked={this.state.isAllSelected} className="headerCheckbox"/>
      </td>
    );
  }

  _generateCheckBoxCol(row) {
    const isChecked = this.state.selected.indexOf(row.id) !== -1;

    return (
      <td>
         <Checkbox onChange={this._check.bind(this, row)} isChecked={isChecked}/>
      </td>
    );
  }

  _generateHeaderColumns() {
    return this.props.config.columns.map((col, index) => {
      const className = classNames(styles.tableHeader, styles['column-' + index]);
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

  _generateRows() {
    const rowData = this._orderData();

    return rowData.map((data) => {
      const td = this._generateTableCel(data);

      if (!this.props.config.noCheck) {
        td.unshift(this._generateCheckBoxCol(data));
      }

      return (<tr className={styles.tableBodyRow}>{td}</tr>);
    });
  }

  _generateTableCel(rowData) {
    return this.props.config.columns.map((col) => {
      let insideTd = rowData[col.key];
      if (col.render) {
        insideTd = col.render(rowData[col.key] || rowData);
      }

      return (<td style={col.styles} onClick={this._onRowClick.bind(this, rowData)}>{insideTd}</td>);
    });
  }

  _selectAll() {
    if (this.state.isAllSelected) {
      this.setState({
        isAllSelected: false,
        selected: [],
      });
    } else {
      this.setState({
        isAllSelected: true,
        partialChecked: false,
        selected: pluck(this.props.data, 'id'),
      });
    }
  }

  _check(data) {
    const id = data.id;
    const selected = this.state.selected;
    const index = selected.indexOf(id);

    if (index === -1) {
      selected.push(id);
    } else {
      selected.splice(index, 1);
    }

    this.setState({selected: selected, partialChecked: false});

    if (selected.length === this.props.data.length) {
      this.setState({isAllSelected: true});
    } else {
      this.setState({isAllSelected: false});
      if (selected.length > 0) {
        this.setState({partialChecked: true});
      }
    }
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

  render() {
    let headerCheckboxColumn = null;
    if (!this.props.config.noCheck) {
      headerCheckboxColumn = this._generateHeaderCheckBoxCol();
    }

    const headerColumns = this._generateHeaderColumns();
    const rows = this._generateRows();

    return (
      <table className={cx(styles.table, this.props.className)}>
        <thead className={styles.tableHeader}>
          <tr>{[headerCheckboxColumn, ...headerColumns]}</tr>
        </thead>

        <tbody className={styles.tableBody}>
        {rows}
        </tbody>
      </table>
    );
  }
}

export default Table;
