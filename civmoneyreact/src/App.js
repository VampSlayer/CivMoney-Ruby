import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

import Login from './Components/Login'
import Main from './Main';
import Register from './Components/Register';
import NotFound from './Components/NotFound';

import './App.css';
import './Table.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false
    };
    this.Auth = this
      .Auth
      .bind(this);
  }

  componentDidMount() {
    if (sessionStorage.loggedIn) {
      this.setState({loggedIn: true});
    }
  }

  Auth() {
    sessionStorage.setItem("loggedIn", true);
    this.setState({loggedIn: true});
  }

  loggedIn() {
    return this.state.loggedIn || sessionStorage.loggedIn;
  }

  render() {
    return (
      <Router>
        <div>
          <Route
            exact
            path="/"
            component={() => this.loggedIn()
            ? <Main/>
            : <Redirect to="/login"/>}/>
          <Route
            exact
            path="/dashboard"
            component={() => this.loggedIn()
            ? <Main/>
            : <Redirect to="/login"/>}/>
          <Route
            exact
            path="/user/user/logout"
            component={() => this.loggedIn()
            ? <Main/>
            : <Redirect to="/login"/>}/>
          <Route
            exact
            path="/manage"
            component={() => this.loggedIn()
            ? <Main/>
            : <Redirect to="/login"/>}/>
          <Route
            exact
            path="/monthlyFixedTransactions"
            component={() => this.loggedIn()
            ? <Main/>
            : <Redirect to="/login"/>}/>
          <Route
            exact
            path="/user"
            component={() => this.loggedIn()
            ? <Main/>
            : <Redirect to="/login"/>}/>
	  <Route
            exact
            path="/notFound"
            component={() => this.loggedIn()
            ? <NotFound/>
            : <Redirect to="/login"/>}/>
          <Route exact path="/register" component={() => <Register Auth={this.Auth}/>}/>
          <Route exact path="/login" component={() => <Login Auth={this.Auth}/>}/>
        </div>
      </Router>
    );
  }
}

export default App;
