import React, {Component} from 'react';
import SearchInput, {createFilter} from 'react-search-input'

import * as url from './Url.js';

import $ from 'jquery';

import ManageTable from './ManageTable';
import CivMoneyFooter from './CivMoneyFooter';

class Manage extends Component {
    constructor() {
        super();
        this.state = {
            transactions: [],
            currency: '',
            startDate: '',
            endDate: '',
            searchTerm: ''
        }
        this.handleStartDateChange = this
            .handleStartDateChange
            .bind(this);
        this.handleEndDateChange = this
            .handleEndDateChange
            .bind(this);
        this.searchUpdated = this
            .searchUpdated.
            bind(this);
	this.deleteAll = this
            .deleteAll.
            bind(this);
	this.delete = this
            .delete.
            bind(this);
    }
    
    searchUpdated (term) {
        this.setState({searchTerm: term});
    }

    handleEndDateChange(event) {
        this.setState({endDate: event.target.value});
    }

    handleStartDateChange(event) {
        this.setState({startDate: event.target.value});
    }

    getTransactions(transactionType) {
        var dateString0 = this.state.startDate;
        var year0 = dateString0.substring(0, 4);
        var month0 = dateString0.substring(5, 7);
        var day0 = dateString0.substring(8, 10);

        var dateString1 = this.state.endDate;
        var year1 = dateString1.substring(0, 4);
        var month1 = dateString1.substring(5, 7);
        var day1 = dateString1.substring(8, 10);

        $.ajax({
            url: url.GetBaseurl() + '/transactions/range' + transactionType + '?[year0]=' + year0 + '&[month0]=' + month0 + '&[day0]=' + day0 + '&[year1]=' + year1 + '&[month1]=' + month1 + '&[day1]=' + day1,
            type: "get",
            dataType: "json",
            data: {},
            async: true,
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

    componentDidMount() {
        this.getCurrency();
    }

    delete(id) {
        $.ajax({
            type: "post",
            url: url.GetBaseurl() + '/transactions/delete?[id]=' + id,
            async: true,
            xhrFields: {
                withCredentials: true
            },
            success: function () {
                for (var i = 0; i < this.state.transactions.length; i++) {
                    if (this.state.transactions[i].id === id) {
                        var newTransactions = this.state.transactions;
                        newTransactions.splice(i, 1);
                        this.setState({transactions: newTransactions});
                    }
                }
            }.bind(this),
            error: function (xhr, status, error) {
                console.log(xhr.status);
            }
        });
    }

    deleteAll(transactions) {
        for (var i = 0; i < transactions.length; i++) {
            $.ajax({
                type: "post",
                url: url.GetBaseurl() + '/transactions/delete?[id]=' + transactions[i].id,
                async: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
		        for (var i = 0; i < this.state.transactions.length; i++) {
				for (var j = 0; j < transactions.length; j++) {
				    if (this.state.transactions[i].id === transactions[j].id) {
				        var newTransactions = this.state.transactions;
				        newTransactions.splice(i, 1);
				        this.setState({transactions: newTransactions});
				    }
				}
		        }
                }.bind(this),
                error: function (xhr, status, error) {
                    console.log(xhr.status);
                }
            });
        }
    }

    render() {
	var startDateBeforeEndDate = Date.parse(this.state.startDate) > Date.parse(this.state.endDate);
	var disabled = startDateBeforeEndDate || this.state.startDate === '' || this.state.endDate === '';
        return (
            <div>
                <div className="col-lg-10">
                    <br/>
                    <div className="panel-black panel-default panel-heading text-center">
                        Transactions
                    </div>
                </div>

                <div className="col-lg-2">
                    <div className="panel-body">
			{startDateBeforeEndDate ? <p className="text-red">Start Date must be before End Date</p> : null}
                            <label>Start Date</label><input
                                type="date"
                                className="form-control"
                                value={this.state.startDate}
                                onChange={this.handleStartDateChange}/>
                            <label>End Date</label><input
                                type="date"
                                className="form-control"
                                value={this.state.endDate}
                                onChange={this.handleEndDateChange}/>
                            <br/>
                            <button disabled={disabled}
                                onClick={() => this.getTransactions('All')}
                                className="form-control danger btn-primary">Get All</button>
                            <br/>
                            <button disabled={disabled}
                                onClick={() => this.getTransactions('Expenses')}
                                className="form-control danger btn-danger">Get Expenses</button>
                            <br/>
                            <button disabled={disabled}
                                onClick={() => this.getTransactions('Incomes')}
                                className="form-control danger btn-success">Get Incomes</button>
			    <br/>
			    {this.state.transactions.length > 0 ? <SearchInput placeholder="Filter Description" className="search-input" onChange={this.searchUpdated} /> : null}
                    </div>
                </div>

                <div className="col-lg-8">
                            <div>
                                {this.state.transactions.length > 0
                                    ? <ManageTable 
					totals={this.state.transactions.filter(createFilter(this.state.searchTerm, ['description']))} 
					currency={this.state.currency}
					delete={this.delete}
					deleteAll={this.deleteAll}/>
                                    : null}
                            </div>
                </div>
                <CivMoneyFooter/>
            </div>
        );
    }
}

export default Manage;
