import React, { Component } from 'react';
import $ from 'jquery';
import * as dates from './Dates.js';
import * as url from './Url.js';
import ReactHover from 'react-hover'
import DailyTable from './DailyTable';

const optionsCursorTrueWithMargin = {
  followCursor: true,
  shiftX: 40,
  shiftY: -150
}

class TableRow extends Component {
  render() {
    const {
      data
    } = this.props;

	let currency = this.props.currency;

    const row = data.map((data) =>
    <tr className={data.date === dates.getTodaysFullDateDashes() ? "bold" : ""}>
	<td className="dailyTable" key={data.date}>
				<ReactHover
				options={optionsCursorTrueWithMargin}>
				<ReactHover.Trigger type='trigger'>
				  <span>{data.date}</span>
				</ReactHover.Trigger>
				<ReactHover.Hover type='hover'>
				  <DailyTable currency={currency} date={data.date}/>		  
				</ReactHover.Hover>
			      </ReactHover>
				</td>  
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
      <table className="table">
		<thead>
			<tr>
				<td><strong>{this.props.headingOne}</strong></td>
				<td><strong>{this.props.headingTwo}</strong></td>
			</tr>
		</thead>
        <TableRow data={this.props.data} currency={this.props.currency}/>
      </table>
    );
  }
}

class SummaryTable extends Component {
constructor(){
	super();
	this.state = {totals: []}
}

getTotals(){
var urlSummaryTable = url.GetBaseurl() + '/transactions/dailyTotalMonth?[year]=' + dates.getTodaysYear() + '&[month]=' + dates.getTodaysMonth();
  $.ajax({
      url: urlSummaryTable,
      type: "get",
      dataType: "json",
      data: {},
      async: true,
	  xhrFields: { withCredentials:true },
      success: function (data) {
         this.setState({totals: data})
      }.bind(this),
	  error: function (xhr, status, error){
		console.log(xhr.status);
	  }
  });

}

compomentWillMount(){this.getTotals();}

componentDidMount(){this.getTotals();}

  render() {
	var headingTwo = 'Total/' + this.props.currency;

    return (
      <div>
          <div className="panel panel-default panel-heading text-center">
              <div className="text-center">Summary</div>
          </div>
          <div className="panel-body">
              <TwoColumnTable data={this.state.totals} headingOne={'Amount'} headingTwo={headingTwo} currency={this.props.currency}/>
          </div>
      </div>
    );
  }
}

export default SummaryTable;
