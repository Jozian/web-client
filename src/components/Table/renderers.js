import React from 'react';
import moment from 'moment';

export function renderDate(data) {
  return (<span>{moment(data).format('DD-MM-YY')}</span>);
}
