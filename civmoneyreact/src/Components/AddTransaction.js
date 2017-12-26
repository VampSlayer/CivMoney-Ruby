import React, {Component} from 'react';
import $ from 'jquery';
import * as url from './Url.js';

class AddTransaction extends Component {
  constructor() {
    super();
    this.state = {
      amount: '',
      description: '',
      date: '',
      income: '',
      expense: '',
      transactionAddResult: ''
    };

    this.handleAmountChange = this
      .handleAmountChange
      .bind(this);
    this.handleDescriptionChange = this
      .handleDescriptionChange
      .bind(this);
    this.handleDateChange = this
      .handleDateChange
      .bind(this);
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

  handleAmountChange(event) {
    this.setState({amount: event.target.value});;
  }

  handleDescriptionChange(event) {
    this.setState({description: event.target.value});
  }

  handleDateChange(event) {
    this.setState({date: event.target.value});
  }

  handleIncomeChange(event) {
    this.setState({income: event.target.checked});
  }

  handleExpenseChange(event) {
    this.setState({expense: event.target.checked});
  }

  handleSubmit(event) {
    var addUrl = url.GetBaseurl() + '/transaction?';
    var year = this
      .state
      .date
      .substring(0, 4);
    var month = this
      .state
      .date
      .substring(5, 7);
    var day = this
      .state
      .date
      .substring(8, 10);
    event.preventDefault();

    $.ajaxSetup({
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
    });

    if (this.state.income === true) {
      $.ajax({
        type: 'POST',
        data: 'transaction[amount]=' + this.state.amount + '&transaction[description]=' + this.state.description + '&transaction[date]=' + year + '.' + month + '.' + day,
        url: addUrl,
        success: function () {
          this.setState({transactionAddResult: 'Transaction added succesfully'});
        }.bind(this),
        error: function () {
          this.setState({transactionAddResult: 'Transaction not added'});
        }.bind(this)
      });
      event.preventDefault();
    } else if (this.state.expense === true) {
      $.ajax({
        type: 'POST',
        data: 'transaction[amount]=' + -this.state.amount + '&transaction[description]=' + this.state.description + '&transaction[date]=' + year + '.' + month + '.' + day,
        url: addUrl,
        success: function () {
          this.setState({transactionAddResult: 'Transaction added succesfully'});
        }.bind(this),
        error: function () {
          this.setState({transactionAddResult: 'Transaction not added'});
        }.bind(this)
      });
      event.preventDefault()
    }

    this
      .props
      .onClick();
  }

  render() {
    const isEnabled = this.state.amount.length > 0 && this.state.description.length > 0 && this.state.date.length > 0 && (this.state.income === true || this.state.expense === true) && !(this.state.income === true && this.state.expense === true);
    return (
      <div>
        <div className="panel-black panel-default panel-heading text-center">
          <div className="text-center">Add Single Transaction</div>
        </div>
        <div className="panel-body">
          <strong className="text-red">{this.state.transactionAddResult}</strong>
          <form onSubmit={this.handleSubmit}>
            <input
              type="number"
              className="form-control"
              placeholder="Amount"
              value={this.state.amount}
              onChange={this.handleAmountChange}/>
            <br/>
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={this.state.description}
              onChange={this.handleDescriptionChange}/>
            <br/>
            <input
              type="date"
              className="form-control"
              placeholder="Date"
              value={this.state.date}
              onChange={this.handleDateChange}/>
            <br/>
            <label><input
              type="checkbox"
              value={this.state.income}
              onChange={this.handleIncomeChange}/>&nbsp;Income</label>
            <span>&nbsp;</span>
            <label><input
              type="checkbox"
              value={this.state.expense}
              onChange={this.handleExpenseChange}/>&nbsp;Expense</label>
            <br/>
            <p></p>
            <input
              disabled={!isEnabled}
              type="submit"
              className="form-control btn-default"/>
          </form>
        </div>
      </div>
    );
  }
}

export default AddTransaction;
