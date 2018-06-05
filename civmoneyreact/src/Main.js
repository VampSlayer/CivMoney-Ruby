import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import {withRR4, Nav, NavText} from 'react-sidenav';
import SvgIcon from 'react-icons-kit';
import {NavIcon} from 'react-sidenav';

import $ from 'jquery';

import * as url from './Components/Url.js';

import {user} from 'react-icons-kit/icomoon/user';
import {ic_dashboard} from 'react-icons-kit/md/ic_dashboard';
import {table2} from 'react-icons-kit/icomoon/table2';
import {arrows_horizontal} from 'react-icons-kit/ikons/arrows_horizontal';

import CivMoneyHome from './Components/CivMoneyHome'
import Manage from './Components/Manage'
import User from './Components/User'
import AddMonthlyFixedTransaction from './Components/AddMonthlyFixedTransaction'

const SideNav = withRR4();

class Main extends Component {
    constructor() {
        super();
        this.state = {
            userName: ''
        }
    }

    getUserName() {
        $.ajax({
            type: "GET",
            url: url.GetBaseurl() + '/user/username',
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            data: {},
            success: function (data) {
                this.setState({userName: data});
            }.bind(this)
        });
    }

    componentDidMount() {
        this.getUserName();
    }

    renderDashboad = () => {
        return <CivMoneyHome/>;
    }

    renderMonthlyFixedTransaction = () => {
	return <AddMonthlyFixedTransaction/>;
    }

    renderManage = () => {
        return <Manage/>;
    }

    renderUser = () => {
        return <User/>;
    }

    logout() {
        $.ajax({
            type: "POST",
            url: url.GetBaseurl() + '/logout',
            xhrFields: {
                withCredentials: true
            },
            success: function () {
                window.location = '/login'
            }
        });
    }

    render() {
        return (
            <Router>
                <div className="container-fluid">
                    <div className="row">
                        <div className="zero-padding col-lg-2">
                            <div
                                style={{
                                display: 'flex',
                                padding: 16
                            }}>
                                <div
                                    style={{
                                    width: 40,
                                    height: 40
                                }}>
                                    <img
                                        src="https://image.ibb.co/dXwVzm/civMoney.jpg"
                                        alt="civMoney"
                                        style={{
                                        borderRadius: '30px',
                                        width: 40,
                                        height: 40
                                    }}/>
                                </div>
                                <h4
                                    style={{
                                    paddingTop: 3,
                                    paddingLeft: 7
                                }}>
                                    {' '}<strong>CivMoney</strong>{' '}
                                </h4>
                            </div>
                            <SideNav default='dashboard' highlightBgColor='white' highlightColor='black'>
                                <Nav id='user'>
                                    <NavIcon><SvgIcon size={20} icon={user}/></NavIcon>
                                    <NavText>{this.state.userName}</NavText>
                                    <Nav id="logout">
                                        <NavText>
                                            <strong>
                                                <button onClick={this.logout} className={'whiteText btn btn-danger'}>Logout</button>
                                            </strong>
                                        </NavText>
                                    </Nav>
                                </Nav>
                                <Nav id='dashboard'>
                                    <NavIcon><SvgIcon size={20} icon={ic_dashboard}/></NavIcon>
                                    <NavText>
                                        Dashboard
                                    </NavText>
                                </Nav>
				<Nav id='monthlyFixedTransactions'>
                                    <NavIcon><SvgIcon size={20} icon={arrows_horizontal}/></NavIcon>
                                    <NavText>
                                        Monthly Fixed Transactions
                                    </NavText>
                                </Nav>
                                <Nav id='manage'>
                                    <NavIcon><SvgIcon size={20} icon={table2}/></NavIcon>
                                    <NavText>
                                        Manage
                                    </NavText>
                                </Nav>
                            </SideNav>
                        </div>
                        <div>
                            <Route exact path="/" render={this.renderDashboad}/>
                            <Route exact path="/dashboard" render={this.renderDashboad}/>
                            <Route exact path="/user" render={this.renderUser}/>
                            <Route exact path="/user/user/logout" render={this.renderUser}/>
                            <Route exact path="/manage" render={this.renderManage}/>
			    <Route exact path="/monthlyFixedTransactions" render={this.renderMonthlyFixedTransaction}/>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}

export default Main;
