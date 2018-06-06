//npm install react-search-input --save
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
    }
    
    searchUpdated (term) {
        this.setState({searchTerm: term})
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

    delete() {
        console.log()
    }

    componentDidMount() {
        this.getCurrency();
    }

    render() {
        const filteredTransactions = 
              this.state.transactions.filter(createFilter(this.state.searchTerm, ['transaction.description']));
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
                        <div className="panel-body">
                            <SearchInput className="search-input" onChange={this.searchUpdated} />
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
                            <button
                                onClick={() => this.getTransactions('All')}
                                className="form-control danger btn-primary">Get All</button>
                            <br/>
                            <button
                                onClick={() => this.getTransactions('Expenses')}
                                className="form-control danger btn-danger">Get Expenses</button>
                            <br/>
                            <button
                                onClick={() => this.getTransactions('Incomes')}
                                className="form-control danger btn-success">Get Incomes</button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                            <div>
                                {this.state.transactions.length > 0
                                    ? <ManageTable totals={filteredTransactions} currency={this.state.currency}/>
                                    : null}
                            </div>
                </div>
                <CivMoneyFooter/>
            </div>
        );
    }
}

export default Manage;
