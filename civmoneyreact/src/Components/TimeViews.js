import React, {Component} from 'react';
import * as url from './Url.js';
import $ from 'jquery';
import TimeViewTable from './TimeViewTable';

class TimeViews extends Component {
    constructor() {
        super();
        this.state = {
            currency: '',
            weeksTotals: '',
            monthsTotals: '',
            yearsTotals: '',
            showWeek: true,
            showMonth: false,
            showYear: false
        };
        this.getThisMonthsWeekTotals = this
            .getThisMonthsWeekTotals
            .bind(this);
        this.onClickMonth = this
            .onClickMonth
            .bind(this);
        this.onClickWeek = this
            .onClickWeek
            .bind(this);
        this.onClickYear = this
            .onClickYear
            .bind(this);
    }

    getYearlyTotals() {
        $.ajax({
            url: url.GetBaseurl() + '/transactions/yearsTotals',
            type: "get",
            dataType: "json",
            data: {},
            async: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var fixedData = data.map((item) => {
                    return {date: item.dateyear, amount: item.amount}
                });
                this.setState({yearsTotals: fixedData});
            }.bind(this),
            error: function (xhr, status, error) {
                console.log(xhr.status);
            }
        });
    }

    getThisMonthsWeekTotals() {
        $.ajax({
            url: url.GetBaseurl() + '/transactions/monthsWeekTotals',
            type: "get",
            dataType: "json",
            data: {},
            async: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var fixedData = data.map((item) => {
                    return {date: item.dateweek, amount: item.amount}
                });
                this.setState({weeksTotals: fixedData});
            }.bind(this),
            error: function (xhr, status, error) {
                console.log(xhr.status);
            }
        });
    }

    getThisYearsMonthsTotals() {
        $.ajax({
            url: url.GetBaseurl() + '/transactions/yearsMonthTotals',
            type: "get",
            dataType: "json",
            data: {},
            async: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var months = [
                    "January",
                    "Febuary",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ];
                var fixedData = data.map((item) => {
                    return {
                        date: months[item.datemonth - 1],
                        amount: item.amount
                    }
                });
                this.setState({monthsTotals: fixedData});
            }.bind(this),
            error: function (xhr, status, error) {
                console.log(xhr.status);
            }
        });
    }

    compomentWillMount() {
        this.getThisMonthsWeekTotals();
        this.getThisYearsMonthsTotals();
        this.getYearlyTotals();
    }

    componentDidMount() {
        this.getThisMonthsWeekTotals();
        this.getThisYearsMonthsTotals();
        this.getYearlyTotals();
    }

    onClickWeek() {
        this.state.showWeek === false
            ? this.setState({showWeek: true})
            : this.setState({showWeek: false});
        this.setState({showMonth: false});
        this.setState({showYear: false});
    }

    onClickMonth() {
        this.state.showMonth === false
            ? this.setState({showMonth: true})
            : this.setState({showMonth: false});
        this.setState({showWeek: false});
        this.setState({showYear: false});
    }

    onClickYear() {
        this.state.showYear === false
            ? this.setState({showYear: true})
            : this.setState({showYear: false});
        this.setState({showWeek: false});
        this.setState({showMonth: false});
    }

    render() {
        var headingTwo = 'Amount/' + this.props.currency;
        return (
            <div>
                <div className="row text-center">
                    <button className="btn btn-default" onClick={this.onClickWeek}>Week</button>&nbsp;
                    <button className="btn btn-default" onClick={this.onClickMonth}>Month</button>&nbsp;
                    <button className="btn btn-default" onClick={this.onClickYear}>Year</button>&nbsp;
                </div>
                <div>{this.state.showWeek
                        ? <TimeViewTable
                                currency={this.props.currency}
                                headingOne={'Week'}
                                headingTwo={headingTwo}
                                totals={this.state.weeksTotals}/>
                        : null} {this.state.showMonth
                        ? <TimeViewTable
                                currency={this.props.currency}
                                headingOne={'Month'}
                                headingTwo={headingTwo}
                                totals={this.state.monthsTotals}/>
                        : null}
                    {this.state.showYear
                        ? <TimeViewTable
                                currency={this.props.currency}
                                headingOne={'Year'}
                                headingTwo={headingTwo}
                                totals={this.state.yearsTotals}/>
                        : null}
                </div>
            </div>
        );
    }
}

export default TimeViews;
