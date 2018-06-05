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
      isIncome: '',
      isExpense: '',
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
    this.handleTypeChange = this
      .handleTypeChange
      .bind(this);
    this.handleSubmit = this
      .handleSubmit
      .bind(this);
  }

  handleAmountChange(event) {
    this.setState({amount: event.target.value});
  }

  handleDescriptionChange(event) {
    this.setState({description: event.target.value});
  }

  handleDateChange(event) {
    this.setState({date: event.target.value});
  }

  handleTypeChange(event) {
    if(event.target.value === "expense"){ this.setState({isExpense: true}); this.setState({isIncome: false});}
    if(event.target.value === "income"){ this.setState({isIncome: true}); this.setState({isExpense: false});}
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

   var amount = this.state.amount;	

    if (this.state.isExpense === true){
	amount = -amount;
    }	
    
      $.ajax({
        type: 'POST',
        data: 'transaction[amount]=' + amount + '&transaction[description]=' + this.state.description + '&transaction[date]=' + year + '.' + month + '.' + day,
        url: addUrl,
        success: function () {
          this.setState({transactionAddResult: 'Transaction added succesfully'});
	  this.props.onClick();
        }.bind(this),
        error: function () {
          this.setState({transactionAddResult: 'Transaction not added'});
        }.bind(this)
      });
      event.preventDefault();
    
  }

  render() {
    const isEnabled = this.state.amount > 0 && this.state.amount.length > 0 && this.state.description.length > 0 && this.state.date.length > 0 && (this.state.isExpense === true || this.state.isIncome === true);
    return (
      <div>
        <div className="panel-black panel-default panel-heading text-center">
          <div className="text-center">Add Single Transaction</div>
        </div>
        <div className="panel-body">
          <strong className="text-red">{this.state.transactionAddResult}</strong>
          <form onSubmit={this.handleSubmit} className="form-group">
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
	    <label>
            <input
	      className="form-control"
              type="radio"
	      name="type"
              value="income"
              onChange={this.handleTypeChange}/>&nbsp;Income</label>
            <span>&nbsp;</span>
            <label><input
              className="form-control"
              type="radio"
	      name="type"
              value="expense"
              onChange={this.handleTypeChange}/>&nbsp;Expense</label>
            <br/>
            <p></p>
            <input
              disabled={!isEnabled}
              type="submit"
	      value="Add Transaction"
              className="form-control btn-default"/>
          </form>
        </div>
      </div>
    );
  }
}

export default AddTransaction;
