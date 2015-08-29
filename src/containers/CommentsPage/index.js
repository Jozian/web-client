import React, { Component } from 'react';
import Table from '../../components/Table/index.js';
import {boldTextRender, buttonRender, dateRender} from '../../components/Table/renders.js';

export default class CommentsPage extends Component {
  onRowClick(value) {
    console.log(value);
  }

  displayChecked() {
    console.log(this.refs.table.getChecked());
  }

  config = {
    columns: [
      {
        key: 'name',
        render: boldTextRender,
      },
      {
        key: 'button',
        render: buttonRender,
        styles: {
          width: '40px',
        },
      },
      {
        key: 'path',
        render: boldTextRender,
        styles: {
          width: '300px',
        },
      },
      {
        key: 'like',
        icon: 'fa fa-thumbs-o-up',
        text: 'Like',
        styles: {
          width: '30px',
        },
      },
      {
        key: 'unlike',
        icon: 'fa fa-thumbs-o-down',
        text: 'Unlike',
        styles: {
          width: '30px',
        },
      },
      {
        key: 'type',
        icon: 'fa fa-file',
        text: 'Type',
        render: boldTextRender,
        styles: {
          width: '90px',
        },
      },
      {
        key: 'date',
        icon: 'fa fa-calendar-o',
        text: 'Date',
        render: dateRender,
        styles: {
          width: '100px',
        },
      },
      {
        key: 'amount',
        icon: 'fa fa-comment',
        text: 'Amount',
        styles: {
          width: '30px',
          textAlign: 'center',
        },
      },
    ],
    noCheck: false,
  };

  data = [
    {
      id: 18,
      name: 'dem',
      type: 'image',
      like: 0,
      unlike: 0,
      path: 'imageTest',
      amount: 12,
      date: '2014-12-01T16:45:26.000Z',
    }, {
      id: 5,
      name: 'Maths',
      type: 'video',
      like: 0,
      unlike: 0,
      path: 'Stage 6',
      amount: 4,
      date: '2015-04-30T18:47:18.000Z',
    }, {
      id: 7,
      name: 'Education Values',
      type: 'video',
      like: 0,
      unlike: 0,
      path: 'Stage 6',
      amount: 3,
      date: '2015-05-06T18:20:24.000Z',
    }, {
      id: 6,
      name: 'Science',
      type: 'video',
      like: 0,
      unlike: 0,
      path: 'Stage 6',
      amount: 2,
      date: '2014-11-03T14:21:30.000Z',
    }, {
      id: 26,
      name: 'Nokia Mobile Mathematics 2011',
      type: 'video',
      like: 0,
      unlike: 0,
      path: 'Sanna\'s Lib',
      amount: 4,
      date: '2014-11-03T14:41:11.000Z',
    }, {
      id: 4,
      name: 'English',
      type: 'video',
      like: 0,
      unlike: 0,
      path: 'Stage 6',
      amount: 5,
      date: '2015-05-06T16:00:03.000Z',
    },
  ];

  render() {
    return (
      <div>
        Commentaries
        <Table ref="table" config={this.config} data={this.data} onRowClick={::this.onRowClick}/>
      </div>
    );
  }
}
