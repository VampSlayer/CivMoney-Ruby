import React, { Component } from 'react';
import SvgIcon from 'react-icons-kit';

import { hourGlass } from 'react-icons-kit/icomoon/hourGlass';
import { plus } from 'react-icons-kit/icomoon/plus';

import * as url from './Url.js';
import * as dates from './Dates.js';

import $ from 'jquery';

import HomeMonthSelectBar from './HomeMonthSelectBar';
import HomeSummaryBar from './HomeSummaryBar';
import AddTransaction from './AddTransaction';
import TimeViews from './TimeViews';
import CivMoneyFooter from './CivMoneyFooter';
import SummaryChart from './SummaryChart';
import SummaryTable from './SummaryTable';

class CivMoneyHome extends Component {
    constructor() {
        super();
        this.state = {
            currency: '',
            showAdd: false,
            showTimeView: false,
            showInOut: false,
            today: '',
            week: '',
            monthNumber: 0,
            thisMonthTotals: [],
            hasChanged: false,
            type: 'Table',
            weeksTotals: {}
        };
        this.onClickAdd = this
            .onClickAdd
            .bind(this);
        this.onClickTimeView = this
            .onClickTimeView
            .bind(this);
        this.onClickShowInOut = this
            .onClickShowInOut
            .bind(this);
        this.handleMainScreenClick = this
            .handleMainScreenClick
            .bind(this);
        this.updateData = this
            .updateData
            .bind(this);
        this.getTotals = this
            .getTotals
            .bind(this);
        this.handleTypeChange = this
            .handleTypeChange
            .bind(this);
        this.handleOnSliderChange = this
            .handleOnSliderChange
            .bind(this);
        this.getMonthsDailyTotals = this
            .getMonthsDailyTotals
            .bind(this);
        this.getMonthsWeekTotals = this
            .getMonthsWeekTotals
            .bind(this);
    }

    handleOnSliderChange = (value) => {
        this.setState({ monthNumber: value });
        this.getMonthsDailyTotals(value);
        this.getMonthTotal(value);
        this.getMonthsWeekTotals(value);
    }

    handleTypeChange(event) {
        this.setState({ type: event.target.value });
    }

    getMonthsWeekTotals(month) {
        $.ajax({
            url: url.GetBaseurl() + '/transactions/monthsWeekTotals?month=' + month,
            type: "get",
            dataType: "json",
            data: {},
            async: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                var fixedData = data.map((item) => {
                    return { date: item.dateweek, amount: item.amount }
                });
                this.setState({ weeksTotals: fixedData });
            }.bind(this),
            error: function (xhr, status, error) {
                console.log(xhr.status);
            }
        });
    }

    getMonthsDailyTotals(month) {
        var urlSummaryTable = url.GetBaseurl() + '/transactions/dailyTotalMonth?[year]=' + dates.getTodaysYear() + '&[month]=' + month;

        $.ajax({
            url: urlSummaryTable,
            type: "get",
            dataType: "json",
            data: {},
            async: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                this.setState({ thisMonthTotals: data })
            }.bind(this),
            error: function (xhr, status, error) {
                console.log(xhr.status);
            }
        });
    }

    getTotals() {
        var dateQuery = dates.getTodaysYear() + '&[month]=' + dates.getTodaysMonth() + '&[day]=' + dates.getTodaysDate();
        var urlDailyTotal = url.GetBaseurl() + '/transactions/dateTotal?[date]=' + dates.getTodaysFullDateDots();
        this.getMonthsDailyTotals(this.state.monthNumber);
        this.getMonthTotal(this.state.monthNumber);

        $.ajax({
            url: urlDailyTotal,
            type: "get",
            dataType: "json",
            data: {},
            async: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                this.setState({ today: data[0].total });
            }.bind(this),
            error: function (xhr, status, error) {
                console.log(xhr.status);
            }
        });
    }

    getMonthTotal(month) {
        var dateQuery = dates.getTodaysYear() + '&[month]=' + month + '&[day]=' + dates.getTodaysDate();
        var urlMonthlyTotal = url.GetBaseurl() + '/transactions/monthTotal?[year]=' + dateQuery;
        $.ajax({
            url: urlMonthlyTotal,
            type: "get",
            dataType: "json",
            data: {},
            async: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                this.setState({ month: data[0].total });
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
                this.setState({ currency: data });
            }.bind(this),
            error: function (xhr, status, error) {
                console.log(xhr.status);
            }
        });
    }

    onClickAdd() {
        this.state.showAdd === false
            ? this.setState({ showAdd: true })
            : this.setState({ showAdd: false });
        this.setState({ showTimeView: false });
        this.setState({ showInOut: false });
    }

    onClickTimeView() {
        this.state.showTimeView === false
            ? this.setState({ showTimeView: true })
            : this.setState({ showTimeView: false });
        this.setState({ showAdd: false });
        this.setState({ showInOut: false });
    }

    onClickShowInOut() {
        this.state.showInOut === false
            ? this.setState({ showInOut: true })
            : this.setState({ showInOut: false });
        this.setState({ showAdd: false });
        this.setState({ showTimeView: false });
    }

    handleMainScreenClick() {
        this.setState({ showAdd: false });
        this.setState({ showTimeView: false });
        this.setState({ showInOut: false });
    }

    updateData() {
        this.getTotals();
	this.getMonthsWeekTotals(this.state.monthNumber);
    }

    componentWillMount() {
        this.setState({ monthNumber: dates.getTodaysMonth() });
    }

    componentDidMount() {
        this.getCurrency();
        this.getTotals();
        this.getMonthsWeekTotals(this.state.monthNumber);
    }

    render() {
        var minimizeView = this.state.showAdd || this.state.showInOut || this.state.showTimeView;
        let totals = {
            today: this.state.today,
            week: this.state.week,
            month: this.state.month
        };
        return (
            <div>
                <div
                    className={minimizeView
                        ? "col-lg-7"
                        : "col-lg-9"}
                    onClick={this.handleMainScreenClick}>
                    <HomeSummaryBar weeksTotals={this.state.weeksTotals} month={this.state.monthNumber} totals={totals} currency={this.state.currency} />
                    <HomeMonthSelectBar month={this.state.monthNumber} type={this.state.type} handleTypeChange={this.handleTypeChange} handleOnSliderChange={this.handleOnSliderChange} />
                    <div className="col-lg-3">
                        <SummaryTable
                            data={this.state.thisMonthTotals}
                            currency={this.state.currency} />
                    </div>
                    <div className="col-lg-9">
                        <SummaryChart
                            data={this.state.thisMonthTotals}
                            currency={this.state.currency} />
                    </div>
                </div>
                <div className="col-lg-1">
                    <br />
                    <button
                        className="form-control btn-default"
                        value="Add"
                        onClick={this.onClickAdd}><SvgIcon size={20} icon={plus} /></button>
                    <br />
                    <button
                        className="form-control btn-default"
                        value="Add"
                        onClick={this.onClickTimeView}><SvgIcon size={20} icon={hourGlass} /></button>
                </div>
                <div className="col-lg-2 top-slide">
                    <br />{this.state.showAdd
                        ? <AddTransaction onClick={this.updateData} />
                        : null}
                    {this.state.showTimeView
                        ? <TimeViews currency={this.state.currency} />
                        : null}
                </div>
                <CivMoneyFooter />
            </div>
        );
    }
}

export default CivMoneyHome;
