import React, {Component} from 'react';

import $ from 'jquery';
import * as url from './Url.js';

import DailyTable from './DailyTable'

class DailyTableWrapper extends Component {
  constructor() {
    super();
    this.state = {
      transactions: []
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

  componentDidMount(){
	this.getTransactions(this.props.date);
	}

  render() {
    return (
      <DailyTable currency={this.props.currency} date={this.props.date} total={this.props.total} transactions={this.state.transactions} />
    );
  }
}

export default DailyTableWrapper;
