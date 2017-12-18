import React, { Component } from 'react';
import $ from 'jquery';
import * as dates from './Dates.js';
import * as url from './Url.js';
import Total from './Total';

class HomeSummaryBar extends Component {
constructor(){
	super();
	this.state = {todaysTotal: '', weeksTotal: '', monthsTotal: ''}
}

getTotals(){
var dateQuery = dates.getTodaysYear() + '&[month]=' + dates.getTodaysMonth() + '&[day]=' + dates.getTodaysDate();

var urlMonthlyTotal = url.GetBaseurl() + '/transactions/monthTotal?[year]=' + dateQuery;
var urlWeeklyTotal = url.GetBaseurl() + '/transactions/weekTotal?[year]=' + dateQuery;
var urlDailyTotal = url.GetBaseurl() + '/transactions/dateTotal?[date]=' + dates.getTodaysFullDateDots();

  $.ajax({
      url: urlDailyTotal,
      type: "get",
      dataType: "json",
      data: {},
      async: true,
	  xhrFields: { withCredentials:true },
      success: function (data) {
         this.setState({todaysTotal: data[0].total})
      }.bind(this),
	  error: function (xhr, status, error){
		console.log(xhr.status);
	  }
  });

  $.ajax({
      url: urlWeeklyTotal,
      type: "get",
      dataType: "json",
      data: {},
      async: true,
	  xhrFields: { withCredentials:true },
      success: function (data) {
         this.setState({weeksTotal: data[0].total})
      }.bind(this),
	  error: function (xhr, status, error){
		console.log(xhr.status);
	  }
  });

  $.ajax({
      url: urlMonthlyTotal,
      type: "get",
      dataType: "json",
      data: {},
      async: true,
	  xhrFields: { withCredentials:true },
      success: function (data) {
         this.setState({monthsTotal: data[0].total})
      }.bind(this),
	  error: function (xhr, status, error){
		console.log(xhr.status);
	  }
  });

}

compomentWillMount(){
	this.getTotals();
}

componentDidMount(){
	this.getTotals();
}

  render() {
    return (
        <div className="col">
                <br/>
                <div className="panel panel-default panel-heading text-center">
					<Total period={'Today'} total={this.state.todaysTotal} currency={this.props.currency} />
					<Total period={'Week'} total={this.state.weeksTotal} currency={this.props.currency} />
					<Total period={'Month'} total={this.state.monthsTotal} currency={this.props.currency} />	
                </div>
       </div>
    );
  }
}

export default HomeSummaryBar;
