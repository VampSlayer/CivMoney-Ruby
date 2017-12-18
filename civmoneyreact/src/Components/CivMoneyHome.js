import React, { Component } from 'react';
import HomeSummaryBar from './HomeSummaryBar';
import SummaryTable from './SummaryTable';
import AddTransaction from './AddTransaction';
import * as url from './Url.js';
import $ from 'jquery';

class CivMoneyHome extends Component {
constructor(){
	super();
	this.state = {currency: ''}
}

getCurrency(){
  $.ajax({
      type: "GET",
      url: url.GetBaseurl() + '/user/currency',
      dataType: "json",
      data: {},
	  async: true,
	  xhrFields: { withCredentials:true },
      success: function(data) {
		this.setState({currency: data});
	  }.bind(this),
	  error: function (xhr, status, error){
		console.log(xhr.status);
	  }
  });
}

compomentWillMount(){this.getCurrency();}

componentDidMount(){this.getCurrency();}

  render() {
    return (
	<div>
		<div className="col-lg-10">
		<HomeSummaryBar currency={this.state.currency}/>
		</div>
		<div className="col-lg-8">
		<SummaryTable currency={this.state.currency}/>
		</div>
		<div className="col-lg-2">
		<AddTransaction />
		</div>
	</div>
    );
  }
}

export default CivMoneyHome;
