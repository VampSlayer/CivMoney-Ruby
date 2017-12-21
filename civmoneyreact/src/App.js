import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Login from './Components/Login'
import Main from './Main';
import './App.css';
import './Table.css';
import './index.css';

class App extends Component {
  render() {
    return (
      <Router>
	     <div>
             <Route exact path="/" component={Main}/>
	      <Route exact path="/dashboard" component={Main}/>
	     <Route exact path="/login" component={Login}/>
	     </div>
      </Router>
    );
  }
}

export default App;
