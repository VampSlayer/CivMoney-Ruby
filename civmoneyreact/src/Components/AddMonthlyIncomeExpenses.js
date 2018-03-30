import React, {Component} from 'react';

import $ from 'jquery';

import * as url from './Url.js';
import * as dates from './Dates.js';

class AddMonthlyIncomeExpenses extends Component {
  constructor() {
    super();
    this.state = {
      income: '',
      expenses: '',
      transactionAddResult: ''
    };

    this.handleIncomeChange = this
      .handleIncomeChange
      .bind(this);
    this.handleExpenseChange = this
      .handleExpenseChange
      .bind(this);
    this.handleSubmit = this
      .handleSubmit
      .bind(this);
  }

  handleIncomeChange(event) {
    this.setState({income: event.target.value});;
  }

  handleExpenseChange(event) {
    this.setState({expenses: event.target.value});
  }

  handleSubmit(event) {

    $.ajaxSetup({
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      async: true
    });

    $.ajax({
      type: "POST",
      url: url.GetBaseurl() + '/transactions/addMonthlyFixedTransaction?',
      data: '[amount]=' + this.state.income + '&[description]=FixedIncome&[year]=' + dates.getTodaysYear() + '&[month]=' + dates.getTodaysMonth(),
      success: function () {
        this.setState({transactionAddResult: 'Income and Expenses succesfully added'});
        location.reload();
      }.bind(this),
      error: function () {
        this.setState({transactionAddResult: 'Income and Expenses  not added'});
      }.bind(this)
    });

    $.ajax({
      type: "POST",
      url: url.GetBaseurl() + '/transactions/addMonthlyFixedTransaction?',
      data: '[amount]=' + -this.state.expenses + '&[description]=FixedExpense&[year]=' + dates.getTodaysYear() + '&[month]=' + dates.getTodaysMonth(),
      success: function () {
        this.setState({transactionAddResult: 'Income and Expenses succesfully added'});
        location.reload();
      }.bind(this),
      error: function () {
        this.setState({transactionAddResult: 'Income and Expenses  not added'});
      }.bind(this)
    });

    event.preventDefault();
  }

  render() {
    const isEnabled = this.state.income.length > 0 && this.state.expenses.length > 0 && this.state.income > 0 && this.state.expenses > 0;
    return (
      <div>
        <div className="panel-black panel-default panel-heading text-center">
          <div className="text-center">Monthly Income & Expenses</div>
        </div>
        <div className="panel-body">
          <strong className="text-red">{this.state.transactionAddResult}</strong>
          <form onSubmit={this.handleSubmit}>
            <p>Add this month's known fixed income and expenses</p>
            <input
              type="number"
              className="form-control"
              placeholder="Income"
              value={this.state.income}
              onChange={this.handleIncomeChange}/>
            <br/>
            <input
              type="number"
              className="form-control"
              placeholder="Expenses"
              value={this.state.expenses}
              onChange={this.handleExpenseChange}/>
            <br/>
            <input
              disabled={!isEnabled}
              type="submit"
	      value="Add Monthly Fixed"
              className="form-control btn-default"/>
          </form>
        </div>
      </div>
    );
  }
}

export default AddMonthlyIncomeExpenses;
