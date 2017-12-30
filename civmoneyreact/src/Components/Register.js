import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';

import $ from 'jquery';

import * as url from './Url.js';

import CivMoneyFooter from './CivMoneyFooter';

class Register extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            passwordConfirmation: '',
            currency: 'CHF',
            error: '',
            passwordDoesNotMatchMessage: ''
        };

        this.handleUsernameChange = this
            .handleUsernameChange
            .bind(this);
        this.handlePasswordChange = this
            .handlePasswordChange
            .bind(this);
        this.handlePasswordConfirmationChange = this
            .handlePasswordConfirmationChange
            .bind(this);
        this.handleCurrencyChange = this
            .handleCurrencyChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
    }

    handleCurrencyChange(event) {
        this.setState({currency: event.target.value});
    }

    handlePasswordConfirmationChange(event) {
        this.setState({passwordConfirmation: event.target.value});
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        var uri = url.GetBaseurl() + '/user?';
        $.ajax({
            type: "POST",
            data: '[username]=' + this.state.username + '&[password]=' + this.state.password + '&[currency]=' + this.state.currency,
            url: uri,
            xhrFields: {
                withCredentials: true
            },
            success: function () {
                this
                    .props
                    .Auth();
                this
                    .props
                    .history
                    .push('/');
            }.bind(this),
            error: function (xhr, statusText, errorThrown) {
                if (xhr.status === 401 || xhr.status === 404) {
                    this.setState({error: 'Username not found or password incorrect'});
                } else {
                    this.setState({error: 'Error occured server side'});
                }
            }.bind(this)
        });
        event.preventDefault();
    }

    render() {
        const isEnabled = this.state.username.length > 0 && this.state.password.length > 0 && this.state.passwordConfirmation.length > 0 && this.state.password === this.state.passwordConfirmation;
        return (
            <div className="container">
                <br/>
                <div className="row">
                    <div className="col-md-4 col-md-offset-4">
                        <div className="login-panel panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Register your CivMoney account</h3>
                            </div>
                            <div className="panel-body">
                                <form onSubmit={this.handleSubmit}>
                                    <fieldset>
                                        <strong className="text-red">{this.state.error}</strong>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                placeholder="Username"
                                                name="username"
                                                type="text"
                                                value={this.state.username}
                                                onChange={this.handleUsernameChange}/>
                                        </div>
                                        {this.state.password !== this.state.passwordConfirmation
                                            ? <strong className="text-red">Passwords do not match</strong>
                                            : null}
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                placeholder="Password"
                                                name="password"
                                                type="password"
                                                value={this.state.password}
                                                onChange={this.handlePasswordChange}/>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                placeholder="Confirm Password"
                                                name="passwordConfirmation"
                                                type="password"
                                                value={this.state.passwordConfirmation}
                                                onChange={this.handlePasswordConfirmationChange}/>
                                        </div>
                                        <div className="form-group">
                                            <p className="black-text">Currency</p>
                                            <select
                                                className="form-control"
                                                onChange={this.handleCurrencyChange}
                                                value={this.state.currency}>
                                                <option value="CHF">CHF</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                                <option value="USD">USD</option>
                                                <option value="JPY">JPY</option>
                                                <option value="PKR">PKR</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                disabled={!isEnabled}
                                                type="submit"
                                                value="Register"
                                                className="btn btn-lg btn-danger btn-block"/>
                                        </div>
                                    </fieldset>
                                </form>
                                <div className="form-group">
                                    <Link className="whiteText" to="/login">
                                        <button className="btn btn-lg btn-success btn-block">Login</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CivMoneyFooter/>
            </div>
        );
    }
}

export default withRouter(Register);
