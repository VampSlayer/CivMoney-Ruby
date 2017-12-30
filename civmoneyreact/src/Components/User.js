import React, {Component} from 'react';

import * as url from './Url.js';

import $ from 'jquery';

import CivMoneyFooter from './CivMoneyFooter';

class User extends Component {
    constructor() {
        super();
        this.state = {
            currency: 'CHF',
            hasChanged: ''
        }
        this.changeUserCurrency = this
            .changeUserCurrency
            .bind(this)
        this.handleCurrencyChange = this
            .handleCurrencyChange
            .bind(this)
    }

    handleCurrencyChange(event) {
        this.setState({currency: event.target.value});
    }

    changeUserCurrency() {
        $.ajax({
            type: "POST",
            url: url.GetBaseurl() + '/user/changeCurrency?',
            data: '[currency]=' + this.state.currency,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function () {
                this.setState({hasChanged: "Success"});
            }.bind(this),
            error: function () {
                this.setState({hasChanged: "Faliure"});
            }.bind(this)
        });
    }

    render() {
        return (
            <div>
                <div className="col-lg-10">
                    <div className="form-group">
                        <br/>
                        <p>Change Currency</p>
                        <strong className="text-red">{this.state.hasChanged}</strong>
                        <select
                            onChange={this.handleCurrencyChange}
                            value={this.state.currency}
                            className="form-control">
                            <option value="CHF">CHF</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="USD">USD</option>
                            <option value="JPY">JPY</option>
                            <option value="PKR">PKR</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <button onClick={this.changeUserCurrency} className="btn btn-danger btn-block">Change Currency</button>
                    </div>
                </div>
                <CivMoneyFooter/>
            </div>
        );
    }
}

export default User;