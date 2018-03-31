import React, {Component} from 'react';
import uuid from 'uuid';

import $ from 'jquery';

import * as url from './Url.js';
import * as dates from './Dates.js';

class AddMonthlyFixedTransaction extends Component {
  constructor() {
    super();
    this.state = {
      transactionAddResult: '',
      enabled: false, 
      incomeTotal: '',
      total: '',
      expenseTotal: '',
      currency: '',
      fixedCosts: [{id: uuid.v4(), amount: '', description: '', isExpense: '', isIncome: ''}]
    };

    this.handleSubmit = this
      .handleSubmit
      .bind(this);
    this.findIndex = this
 	.findIndex
	.bind(this);
    this.doAllFixedCostsHaveValues = this
 	.doAllFixedCostsHaveValues
	.bind(this);
   this.calculateAndShowTotals = this
 	.calculateAndShowTotals
	.bind(this);
  }

  handleAmountChange = (id) => (event) =>  {
    let fixedCosts = this.state.fixedCosts;
    let index = this.findIndex(id);
    fixedCosts[index].amount = event.target.value;
    this.setState({fixedCosts: fixedCosts});
    this.doAllFixedCostsHaveValues();
  }

 handleDescriptionChange = (id) => (event) => {
    let fixedCosts = this.state.fixedCosts;
    let index = this.findIndex(id);
    fixedCosts[index].description = event.target.value;
    this.setState({fixedCosts: fixedCosts});
    this.doAllFixedCostsHaveValues();
  }

  handleTypeChange = (id) => (event) =>  {
    let fixedCosts = this.state.fixedCosts;
    let index = this.findIndex(id);
    if(event.target.value === "expense"){ fixedCosts[index].isExpense = true; fixedCosts[index].isIncome = false;}
    if(event.target.value === "income"){ fixedCosts[index].isIncome = true; fixedCosts[index].isExpense = false;}
    this.setState({fixedCosts: fixedCosts});
    this.doAllFixedCostsHaveValues();
  }

  handleAddShareholder = () => {
    this.setState({ fixedCosts: this.state.fixedCosts.concat([{ id: uuid.v4(), amount: '', description: '', isExpense: '', isIncome: '' }]) });
    this.doAllFixedCostsHaveValues();
  }

  handleRemoveShareholder = (id) => () => {
    let fixedCosts = this.state.fixedCosts;
    let index = this.findIndex(id);
    fixedCosts.splice(index, 1);
    this.setState({fixedCosts: fixedCosts});
    this.doAllFixedCostsHaveValues();
  }

  findIndex(id){
	let fixedCosts = this.state.fixedCosts;
	return fixedCosts.findIndex(x => x.id === id);
  }

  doAllFixedCostsHaveValues(){
	let fixedCosts = this.state.fixedCosts;
	var doAllFixedCostsHaveValues = false;
	for(let fixedCost of fixedCosts){
	  if(fixedCost.amount.length > 0 && fixedCost.amount > 0 && fixedCost.description.length > 0 && (fixedCost.isExpense === true || fixedCost.isIncome === true)){
		doAllFixedCostsHaveValues = true;
	  }
	  else{
		doAllFixedCostsHaveValues = false;
	  }
	}
	this.setState({enabled: doAllFixedCostsHaveValues});
	this.calculateAndShowTotals();
  }

  calculateAndShowTotals(){
	var incomeTotal = 0;
	var expenseTotal = 0;
	let fixedCosts = this.state.fixedCosts;

	for(let fixedCost of fixedCosts){
	   if(fixedCost.isIncome === true){
		if(parseFloat(fixedCost.amount) > 0){
		incomeTotal += parseFloat(fixedCost.amount);
		}
	   }
	   if(fixedCost.isExpense === true){
	      if(parseFloat(fixedCost.amount) > 0){
		expenseTotal += parseFloat(fixedCost.amount);
		}
	   }
	}
	var total = incomeTotal + -expenseTotal;
	this.setState({incomeTotal: incomeTotal});
	this.setState({expenseTotal: expenseTotal});
	this.setState({total: total});
  }

  handleSubmit(event) {

    $.ajaxSetup({
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      async: true
    });
	
   for(let fixedCost of this.state.fixedCosts){ 

    var amount = fixedCost.amount;

    if(fixedCost.isExpense){
	amount = -amount;
    }

    $.ajax({
      type: "POST",
      url: url.GetBaseurl() + '/transactions/addMonthlyFixedTransaction?',
      data: '[amount]=' + amount + '&[description]=' + fixedCost.description + '&[year]=' + dates.getTodaysYear() + '&[month]=' + dates.getTodaysMonth(),
      success: function () {
        this.setState({transactionAddResult: 'Succesfully Added. Go to Dashboard to view.'});
      }.bind(this),
      error: function () {
        this.setState({transactionAddResult: 'Not added'});
      }.bind(this)
    }); 

    event.preventDefault();
   }
  }

    getCurrency() {
        $.ajax({
            type: "GET",
            url: url.GetBaseurl() + '/user/currency',
            dataType: "json",
            data: {},
            async: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                this.setState({currency: data});
            }.bind(this),
            error: function (xhr, status, error) {
                console.log(xhr.status);
            }
        });
    }

    compomentWillMount() {
        this.getCurrency();
    }

    componentDidMount() {
        this.getCurrency();
    }

  render() {
    return (
      <div className="col-lg-10">
	<br/>
        <div className="panel-black panel-default panel-heading text-center">
        <div className="text-center">Monthly Fixed Transactions</div>
        </div>
	<div className="col-lg-6">
	<p>Add your fixed incomes & expenses for this month here. It will take those fixed incomes & expenses and divide by the number of days in this month and add those transactions 	to your account.</p>
        <div className="panel-body">
          <strong className="text-red">{this.state.transactionAddResult}</strong>
          <form onSubmit={this.handleSubmit} className="form-inline form-group">
	  {this.state.fixedCosts.map((fixedCost) => (
	    <div key={fixedCost.Id}>
            <input
              type="number"
              className="form-control col-sm-4 margin-left-form"
              placeholder="Amount"
              value={fixedCost.amount}
              onChange={this.handleAmountChange(fixedCost.id)}/>
            <input
              type="text"
              className="form-control col-sm-4 margin-left-form" 
              placeholder="Description"
              value={fixedCost.description}
              onChange={this.handleDescriptionChange(fixedCost.id)}/>
   	    <label className="margin-left-form">
	        <input onChange={this.handleTypeChange(fixedCost.id)} className="form-control input-group margin-left-form" type="radio" name={"1" + fixedCost.id} value="income"/>&nbsp;Income
	    </label>		
	    <label className="margin-left-form">
		<input onChange={this.handleTypeChange(fixedCost.id)} className="form-control input-group margin-left-form" type="radio" name={"1" + fixedCost.id} value="expense"/>&nbsp;Expense
	    </label>
	    <button type="button" onClick={this.handleAddShareholder} className="form-control small margin-left-form">+</button>
	    <button type="button" onClick={this.handleRemoveShareholder(fixedCost.id)} className="form-control small margin-left-form">--</button>	
            <br/>
	    </div>
	   ))}
	      <input
              disabled={!this.state.enabled}
              type="submit"
	      value="Add Monthly Fixed Transactions"
              className="form-control btn-default"/>
          </form>
        </div>
	</div>
	<div className="col-lg-6">
	{this.state.incomeTotal > 0 ? 
		<h3 className="text-green">Incomes Total : {this.state.incomeTotal} {this.state.currency}</h3> 
		: <span></span>}
	{this.state.expenseTotal > 0 ? 
		<h3 className="text-red">Expenses Total : {this.state.expenseTotal} {this.state.currency}</h3> 
		: <span></span>}
	{this.state.incomeTotal > 0 || this.state.expenseTotal > 0 ? 
		<h2>Total : {this.state.total} {this.state.currency}</h2> 
		: <span></span>}
	</div>
      </div>
    );
  }
}

export default AddMonthlyFixedTransaction;
