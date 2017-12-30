import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';

import $ from 'jquery';

import * as url from './Url.js';

import CivMoneyFooter from './CivMoneyFooter';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      error: ''
    };

    this.handleUsernameChange = this
      .handleUsernameChange
      .bind(this);
    this.handlePasswordChange = this
      .handlePasswordChange
      .bind(this);
    this.handleSubmit = this
      .handleSubmit
      .bind(this);
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});;
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    var uri = url.GetBaseurl() + '/login?';
    $.ajax({
      type: "POST",
      data: '[username]=' + this.state.username + '&[password]=' + this.state.password,
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
    const isEnabled = this.state.username.length > 0 && this.state.password.length > 0;
    return (
      <div className="container">
        <br/>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="login-panel panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Log in to your CivMoney account</h3>
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
                        disabled={!isEnabled}
                        type="submit"
                        value="Login"
                        className="btn btn-lg btn-success btn-block"/>
                    </div>
                  </fieldset>
                </form>
                <div className="form-group">
                  <Link className="whiteText" to="/register">
                    <button className="btn btn-lg btn-danger btn-block">Register</button>
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

export default withRouter(Login);
