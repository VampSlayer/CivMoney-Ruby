import React, {Component} from 'react';
import uuid from 'uuid';

import $ from 'jquery';

import * as url from './Url.js';
import * as dates from './Dates.js';
import MonthlyFixedTransactionTable from './MonthlyFixedTransactionTable'

class AddMonthlyFixedTransaction extends Component {
  constructor() {
    super();
    this.state = {
      transactionAddResult: '',
      enabled: false, 
      currency: '',
      fixedCosts: [{id: uuid.v4(), amount: '', description: '', isExpense: '', isIncome: ''}],
      fixedCostsWithTotals: [],
      month: ''
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
   this.addTotals = this
 	.addTotals
	.bind(this);
  }
	
  handleMonthChange = () => (event) => {
   var monthNumber = dates.GetMonthNumber(event.target.value);	  
   this.setState({month: monthNumber});
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
	  if(parseFloat(fixedCost.amount) != 0 && fixedCost.amount != "" && fixedCost.description.length > 0 && (fixedCost.isExpense === true || fixedCost.isIncome === true)){
		doAllFixedCostsHaveValues = true;
	  }
	  else{
		doAllFixedCostsHaveValues = false;
	  }
	}
	this.setState({enabled: doAllFixedCostsHaveValues});
	this.addTotals();
  }

  addTotals(){
	var incomeTotal = 0;
	var expenseTotal = 0;
	console.log(this.state.fixedCosts);

	var fixedCostsWithTotals = [];
	let fixedCosts = this.state.fixedCosts;
	
	for(let fixedCost of fixedCosts){
		   if(fixedCost.isIncome === true){
			if(parseFloat(fixedCost.amount) < 0){ fixedCost.amount = (fixedCost.amount * -1);}
			incomeTotal += parseFloat(fixedCost.amount);
		   }
		   if(fixedCost.isExpense === true){  
		      if(parseFloat(fixedCost.amount) > 0){
			fixedCost.amount = -fixedCost.amount;	
			}
			expenseTotal += parseFloat(fixedCost.amount);	
		   }
		fixedCostsWithTotals.push(fixedCost);
		}

	var total = incomeTotal + expenseTotal;
	
        fixedCostsWithTotals.push({ id: uuid.v4(), amount: incomeTotal, description: 'Income Total', isExpense: '', isIncome: true });
	fixedCostsWithTotals.push({ id: uuid.v4(), amount: expenseTotal, description: 'Expense Total', isExpense: true, isIncome: '' });
	fixedCostsWithTotals.push({ id: uuid.v4(), amount: total, description: 'Total', isExpense: '', isIncome: '' });
	this.setState({fixedCostsWithTotals: fixedCostsWithTotals});
  }

  handleSubmit(event) {
    event.preventDefault();  	

   $.ajaxSetup({
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      async: true
    });
	
   for(let fixedCost of this.state.fixedCosts){
	if(parseFloat(fixedCost.amount) != 0 && fixedCost.amount != "" && fixedCost.description.length > 0 && (fixedCost.isExpense === true || fixedCost.isIncome === true)){
	    $.ajax({
	      type: "POST",
	      url: url.GetBaseurl() + '/transactions/addMonthlyFixedTransaction?',
	      data: '[amount]=' + fixedCost.amount + '&[description]=' + fixedCost.description + '&[year]=' + dates.getTodaysYear() + '&[month]=' + dates.getTodaysMonth(),
	      success: function () {
		this.setState({transactionAddResult: 'Succesfully Added Transactions. Go to Dashboard to view.'});
	      }.bind(this),
	      error: function () {
		this.setState({transactionAddResult: 'Transactions Not added'});
	      }.bind(this)
	    }); 
	}
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
	    <button disabled={this.state.fixedCosts.length === 1} type="button" onClick={this.handleRemoveShareholder(fixedCost.id)} className="form-control small margin-left-form">--</button>	
            <br/>
	    </div>
	   ))}
	   <label>Month</label>
	    <select multiple={true} value={dates.GetMonths()} onChange={this.handleMonthChange}>
	      <input
              disabled={!this.state.enabled}
              type="submit"
	      value="Add Monthly Fixed Transactions"
              className="form-control btn-default"/>
          </form>
        </div>
	</div>
	<div className="col-lg-6">
	{this.state.fixedCostsWithTotals.length > 0
		? <MonthlyFixedTransactionTable totals={this.state.fixedCostsWithTotals} currency={this.state.currency}/> 
		: <span></span>}
	</div>
      </div>
    );
  }
}

export default AddMonthlyFixedTransaction;
