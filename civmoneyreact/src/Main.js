import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import CivMoneyHome from './Components/CivMoneyHome'
import { withRR4, Nav, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import { NavIcon } from 'react-sidenav';
import $ from 'jquery';
import * as url from './Components/Url.js';

import { user } from 'react-icons-kit/icomoon/user'; 
import { ic_dashboard } from 'react-icons-kit/md/ic_dashboard';          

const SideNav = withRR4();

class Sales extends Component {

    componentWillUnmount() {
        console.log('Sales Will Unmount');
    }

    render() {
        return (
            <div>Sales</div>
        );
    }
}

class Main extends Component {
constructor(){
	super();
	this.state = {userName: ''}
}

getUserName(){
  $.ajax({
      type: "GET",
      url: url.GetBaseurl() + '/user/username',
      dataType: "json",
      async: true,
	  xhrFields: { withCredentials:true },
      data: {},
      success: function(data) {
         this.setState({userName: data});
      }.bind(this)
  });
}

compomentWillMount(){this.getUserName();}

componentDidMount(){this.getUserName();}

    renderDashboad = () => {
        return <CivMoneyHome />;
    }

    renderSales = () => {
        return <Sales />;
    }

    renderProducts = () => {
        return <div>Products</div>;
    }

  render() {
    return (
      <Router>
                 <div className="container-fluid">
	           <div className="row">
                    <div className="zero-padding col-lg-2">
			<div style={{ display: 'flex', padding: 16, background: 'black' }}>
                        <div style={{ width: 40, height: 40 }}>
                            <img
                                src="https://image.ibb.co/dXwVzm/civMoney.jpg" alt="civMoney"
                                style={{ borderRadius: '30px', width: 40, height: 40 }}
                            />
                        </div>
                        <div style={{ paddingLeft: 6, paddingTop: 11, color: 'white'}}>
                                {' '}CivMoney{' '}
                        </div>
			</div>
                        <SideNav default='dashboard' highlightBgColor='black' highlightColor='white'>
			    <Nav id='user'>
				<NavIcon><SvgIcon size={20} icon={user}/></NavIcon> 
				<NavText>{this.state.userName}</NavText>
				<Nav id='user-list'>
                                    <NavText> <a>Logout</a> </NavText>
                                </Nav>
			    </Nav>
                            <Nav id='dashboard'>
			        <NavIcon><SvgIcon size={20} icon={ic_dashboard}/></NavIcon> 
                                <NavText>  Dashboard </NavText>
                            </Nav>
                            <Nav id='sales'>
                                <NavText> Sales </NavText>
                                <Nav id='list'>
                                    <NavText> List Sales </NavText>
                                </Nav>
                            </Nav>
                            <Nav id='products'>
                                <NavText>  Products </NavText>
                            </Nav>
                        </SideNav>
                    </div>
                    <div>
			<Route exact path="/" render={this.renderDashboad}/>
                        <Route exact path="/dashboard" render={this.renderDashboad}/>
                        <Route path="/sales" render={this.renderSales}/>
                        <Route path="/products" render={this.renderProducts}/>		
                    </div>
                </div>
	</div>
</Router>
    );
  }
}

export default Main;
