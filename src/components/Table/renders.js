import React from 'react';
import moment from 'moment';
import styles from './index.css';

export function dateRender(data) {
  return (<span>{moment(data).format('DD-MM-YY')}</span>);
}

export function boldTextRender(data) {
  return (<b>{data}</b>);
}

export function buttonRender(data) {
  const style = {
    float: 'right',
    cursor: 'pointer',
  };

  function changeState() {
    location.href = 'afterButton/' + data.id;
  }

  return (
    <button className={styles['b_table-button']} style={style} onClick={changeState}>
      <i className="fa fa-search"></i>
    </button>
  );
}
