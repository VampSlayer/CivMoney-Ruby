import React, { Component } from 'react';
import $ from 'jquery';
import * as url from './Url.js';

class TableRow extends Component {
  render() {
    const {
      data
    } = this.props;

    const row = data.map((data) =>
    <tr>
	  <td key={data.description}>{data.description}</td>  
      <td className={data.amount === '0.0' || data.amount === '0' ? "text-orange" : data.amount > 0 ? "text-green" : "text-red"} key={data.amount}>{data.amount}</td>
    </tr>
    );

    return (
      <tbody>{row}</tbody>
    );
  }
}

class TwoColumnTable extends Component {
  render() {
    return (
      <table className={'daily-table'}>
		<thead>
			<tr>
				<td><strong>{this.props.headingOne}</strong></td>
				<td><strong>{this.props.headingTwo}</strong></td>
			</tr>
		</thead>
        <TableRow data={this.props.data} />
      </table>
    );
  }
}

class DailyTable extends Component {
constructor(){
	super();
	this.state = {transactions: []}
}

getTransactions(){
var urlTransactions = url.GetBaseurl() + '/transactions/date?[date]=' + this.props.date;
        $.ajax({
            url: urlTransactions,
            type: "get",
            dataType: "json",
            data: {},
            async: true,
			  xhrFields: { withCredentials:true },
			  success: function (data) {
				 this.setState({transactions: data})
			  }.bind(this),
			  error: function (xhr, status, error){
				console.log(xhr.status);
	  		}
        });
}

compomentWillMount(){this.getTransactions();}

componentDidMount(){this.getTransactions();}

  render() {
	var currency = 'Amount/' + this.props.currency;
	if(this.props.hasChanged === true){ this.getTransactions() }
    return (
      <div>
           <TwoColumnTable data={this.state.transactions} headingOne={'Description'} headingTwo={currency}/>
      </div>
    );
  }
}

export default DailyTable;
