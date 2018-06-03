import React, {Component} from 'react';

import $ from 'jquery';

import * as url from './Url.js';

import DailyTable from './DailyTable';

class ChartCustomToolTip extends Component {
  constructor() {
    super();
    this.state = {
      transactions: [],
      date: ''
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


  render() {
    const { active } = this.props;

    if (active) {
      const { label, currency, payload } = this.props;
      if(typeof label !== "undefined" && payload !== null){
      if(typeof label !== "undefined" && this.state.date !== label){this.getTransactions(label);}
      
      return (
	<DailyTable transactions={this.state.transactions} currency={currency} total={payload[0].value} date={label}/>
      );
	}
    }

    return null;
  }
}

export default ChartCustomToolTip;
