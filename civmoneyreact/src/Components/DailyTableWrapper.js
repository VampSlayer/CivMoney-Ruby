import React, {Component} from 'react';

import $ from 'jquery';
import * as url from './Url.js';

import DailyTable from './DailyTable'

class DailyTableWrapper extends Component {
  constructor() {
    super();
    this.state = {
      transactions: [],
      date: '',
      total: ''
    }
  }

  getTransactions(date) {
    this.setState({date: date});
    var urlTransactions = url.GetBaseurl() + '/transactions/date?[date]=' + date;
    $.ajax({
      url: urlTransactions,
      type: "get",
      dataType: "json",
      xhrFields: {
        withCredentials: true
      },
      success: function (data) {
        this.setState({transactions: data})
      }.bind(this),
      error: function (xhr, status, error) {
        console.log(xhr.status);
      }
    });
  }

componentWillReceiveProps(nextProps) {
  if (nextProps.total !== this.state.total && this.state.date === nextProps.date) {
   this.setState({total: nextProps.total});
   this.getTransactions(nextProps.date);
  }
}

  componentDidMount(){
	this.setState({total: this.props.total});
	this.getTransactions(this.props.date);
   }

  render() {
    return (
      <DailyTable currency={this.props.currency} date={this.props.date} total={this.props.total} transactions={this.state.transactions} />
    );
  }
}

export default DailyTableWrapper;
