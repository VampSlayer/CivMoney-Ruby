import React, { Component } from 'react';
import HomeSummaryBar from './HomeSummaryBar';
import SummaryTable from './SummaryTable';
import AddTransaction from './AddTransaction';
import AddMonthlyIncomeExpenses from './AddMonthlyIncomeExpenses';
import * as url from './Url.js';
import * as dates from './Dates.js';
import $ from 'jquery';
import SvgIcon from 'react-icons-kit';
import { arrows_horizontal } from 'react-icons-kit/ikons/arrows_horizontal';
import { hourGlass } from 'react-icons-kit/icomoon/hourGlass';

import { plus } from 'react-icons-kit/icomoon/plus';

class CivMoneyHome extends Component {
constructor(){
	super();
	this.state = {currency: '', showAdd: false, showTimeView: false, showInOut: false, totals: {}, thisMonthTotals: [], hasChanged: false};
	this.onClickAdd = this.onClickAdd.bind(this);
	this.onClickTimeView = this.onClickTimeView.bind(this);
	this.onClickShowInOut = this.onClickShowInOut.bind(this);
	this.handleMainScreenClick = this.handleMainScreenClick.bind(this);
	this.updateData = this.updateData.bind(this);
	this.getTotals = this.getTotals.bind(this);
}

getTotals(){
var dateQuery = dates.getTodaysYear() + '&[month]=' + dates.getTodaysMonth() + '&[day]=' + dates.getTodaysDate();

var urlMonthlyTotal = url.GetBaseurl() + '/transactions/monthTotal?[year]=' + dateQuery;
var urlWeeklyTotal = url.GetBaseurl() + '/transactions/weekTotal?[year]=' + dateQuery;
var urlDailyTotal = url.GetBaseurl() + '/transactions/dateTotal?[date]=' + dates.getTodaysFullDateDots();

var totals = {today: '', week: '', month: ''};
var urlSummaryTable = url.GetBaseurl() + '/transactions/dailyTotalMonth?[year]=' + dates.getTodaysYear() + '&[month]=' + dates.getTodaysMonth();

  $.ajax({
      url: urlSummaryTable,
      type: "get",
      dataType: "json",
      data: {},
      async: true,
	  xhrFields: { withCredentials:true },
      success: function (data) {
         this.setState({thisMonthTotals: data})
      }.bind(this),
	  error: function (xhr, status, error){
		console.log(xhr.status);
	  }
  });

  $.ajax({
      url: urlDailyTotal,
      type: "get",
      dataType: "json",
      data: {},
      async: true,
	  xhrFields: { withCredentials:true },
      success: function (data) {
	totals.today =  data[0].total;
      },
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
	totals.week = data[0].total;
      },
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
         totals.month =  data[0].total;
				 this.setState({totals: totals});
      }.bind(this),
	  error: function (xhr, status, error){
		console.log(xhr.status);
	  }
  });
}

getCurrency(){
  $.ajax({
      type: "GET",
      url: url.GetBaseurl() + '/user/currency',
      dataType: "json",
      data: {},
	  async: true,
	  xhrFields: { withCredentials:true },
      success: function(data) {
		this.setState({currency: data});
	  }.bind(this),
	  error: function (xhr, status, error){
		console.log(xhr.status);
	  }
  });
}

onClickAdd(){
	this.state.showAdd === false ? this.setState({showAdd: true}) : this.setState({showAdd: false});
	this.setState({showTimeView: false});
	this.setState({showInOut: false});
}

onClickTimeView(){
	this.state.showTimeView === false ? this.setState({showTimeView: true}) : this.setState({showTimeView: false});
	this.setState({showAdd: false});
	this.setState({showInOut: false});
}

onClickShowInOut(){
	this.state.showInOut === false ? this.setState({showInOut: true}) : this.setState({showInOut: false});
	this.setState({showAdd: false});
	this.setState({showTimeView: false});
}

handleMainScreenClick(){
	this.setState({showAdd: false});
	this.setState({showTimeView: false});
	this.setState({showInOut: false});
}

updateData(){
	this.getTotals();
	this.setState({hasChanged: true})
}

compomentWillMount(){this.getCurrency(); this.getTotals();}

componentDidMount(){this.getCurrency(); this.getTotals()}

  render() {
	var minimizeView = this.state.showAdd || this.state.showInOut || this.state.showTimeView;
	console.log(this.state);
    return (
	<div>
		<div className={minimizeView ? "col-lg-7" : "col-lg-9"} onClick={this.handleMainScreenClick}>
		<HomeSummaryBar totals={this.state.totals} currency={this.state.currency}/>
		<SummaryTable totals={this.state.thisMonthTotals} currency={this.state.currency} hasChanged={this.state.hasChanged}/>
		</div>
		<div className="col-lg-1">
			<br/><button className="form-control btn-default" value="Add" onClick={this.onClickAdd}><SvgIcon size={20} icon={plus}/></button>
			<br/><button className="form-control btn-default" value="Add" onClick={this.onClickShowInOut}><SvgIcon size={20} icon={arrows_horizontal}/></button>
			<br/><button className="form-control btn-default" value="Add" onClick={this.onClickTimeView}><SvgIcon size={20} icon={hourGlass}/></button>
		</div>
		<div className="col-lg-2 top-slide">
			<br/>{ this.state.showAdd ? <AddTransaction onClick={this.updateData}/> : null }
			     { this.state.showInOut ? <AddMonthlyIncomeExpenses /> : null }
			     { this.state.showTimeView ? <AddTransaction /> : null }
		</div>
	</div>
    );
  }
}

export default CivMoneyHome;
